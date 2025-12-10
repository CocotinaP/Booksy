from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from ..models import Book, RentalHistory, UserProfile
from ..serializers import BookSerializer


class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        profile, created = UserProfile.objects.get_or_create(user=user)

        #Excludem carti deja citite
        read_history_qs = RentalHistory.objects.filter(user_profile=profile)
        read_book_ids = list(read_history_qs.values_list('book__id', flat=True))

        #Extragem ce autori ii plac (din istoric si din favourites)
        fav_authors = list(profile.favorite_authors.values_list('name', flat=True))
        history_authors = list(read_history_qs.values_list('book__author', flat=True))

        #Eliminam duplicatele
        target_authors = set(fav_authors + history_authors)

        #Extragem genurile preferate
        target_genres = set(profile.favorite_genres.values_list('name', flat=True))


        #Luam toate carțile care NU sunt citite si care sunt disponibile
        candidates = Book.objects.exclude(id__in=read_book_ids).filter(
            available=True
        ).filter(
            Q(genre__in=target_genres) | Q(author__in=target_authors)
        ).distinct()

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


        scored_books.sort(key=lambda x: x['score'], reverse=True)

        top_recommendations = [item['book'] for item in scored_books[:10]]

        serializer = BookSerializer(top_recommendations, many=True)

        return Response(serializer.data)