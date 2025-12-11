from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from ..models import Book, RentalHistory, UserProfile, BookRequest
from ..serializers import BookSerializer

class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Încercăm să luăm profilul, dar nu crăpăm dacă nu există
        profile, _ = UserProfile.objects.get_or_create(user=user)

        # 1. COLECTAREA DATELOR (ISTORIC + PREFERINȚE)
        
        # A. Cărți din RentalHistory
        read_history_qs = RentalHistory.objects.filter(user_profile=profile)
        history_book_ids = list(read_history_qs.values_list('book__id', flat=True))
        history_authors = list(read_history_qs.values_list('book__author', flat=True))
        history_genres = list(read_history_qs.values_list('book__genre', flat=True))

        # B. Cărți din BookRequests (Cererile tale curente/trecute)
        # Asta e important pentru că probabil aici ai datele acum
        requests_qs = BookRequest.objects.filter(requester=user)
        request_book_ids = list(requests_qs.values_list('book__id', flat=True))
        request_authors = list(requests_qs.values_list('book__book__author', flat=True))
        request_genres = list(requests_qs.values_list('book__book__genre', flat=True))

        # Lista completă de ID-uri de exclus (ce am citit/cerut deja)
        exclude_ids = set(history_book_ids + request_book_ids)

        # C. Preferințe explicite (Favorite)
        fav_authors = list(profile.favorite_authors.values_list('name', flat=True))
        fav_genres = list(profile.favorite_genres.values_list('name', flat=True))

        # 2. CONSOLIDAREA ȚINTELOR (Target)
        target_authors = set(fav_authors + history_authors + request_authors)
        target_genres = set(fav_genres + history_genres + request_genres)

        # Curățăm valorile goale (None/Empty)
        target_authors.discard(None); target_authors.discard("")
        target_genres.discard(None); target_genres.discard("")

        # 3. CĂUTAREA CANDIDAȚILOR
        # Dacă nu avem nicio preferință, nu putem filtra smart -> trecem direct la Fallback
        if not target_authors and not target_genres:
            candidates = []
        else:
            candidates = Book.objects.exclude(id__in=exclude_ids).exclude(owner=user).filter(
                available=True
            ).filter(
                Q(genre__in=target_genres) | Q(author__in=target_authors)
            ).distinct()

        # 4. SCORING (Sistemul tău original)
        scored_books = []
        for book in candidates:
            score = 0
            if book.author in target_authors:
                score += 10
            if book.genre in target_genres:
                score += 5
            scored_books.append({
                'book': book,
                'score': score
            })

        # Sortăm descrescător după scor
        scored_books.sort(key=lambda x: x['score'], reverse=True)
        top_recommendations = [item['book'] for item in scored_books[:10]]

        # 5. FALLBACK (PLASA DE SIGURANȚĂ)
        # Dacă lista e goală (user nou), dăm ultimele 5 cărți adăugate de alții
        if not top_recommendations:
            top_recommendations = Book.objects.exclude(owner=user).order_by('-id')[:5]

        serializer = BookSerializer(top_recommendations, many=True)
        return Response(serializer.data)