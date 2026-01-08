from collections import defaultdict
import random

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from ..models.quiz import QuizQuestion, QuizAnswerOption
from ..models import Book, Genre
from ..serializers import (
    QuizQuestionSerializer,
    QuizSubmitSerializer,
    RecommendedBookSerializer,
)


class QuizQuestionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        questions = QuizQuestion.objects.prefetch_related('options').all()
        serializer = QuizQuestionSerializer(questions, many=True)
        return Response(serializer.data)


class QuizSubmitView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = QuizSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        answers = serializer.validated_data['answers']

        genre_scores = defaultdict(int)

        for ans in answers:
            option_id = ans.get('option_id')
            try:
                option = QuizAnswerOption.objects.select_related('genre').get(id=option_id)
            except QuizAnswerOption.DoesNotExist:
                continue

            if option.genre:
                genre_scores[option.genre.id] += option.weight

        if not genre_scores:
            return Response({"detail": "Nu s-a putut determina un gen potrivit."}, status=400)

        best_genre_id = max(genre_scores, key=genre_scores.get)
        best_genre = Genre.objects.get(id=best_genre_id)

        books = Book.objects.filter(genre=best_genre.name)
        if not books.exists():
            return Response({
                "detail": f"Genul potrivit pare a fi: {best_genre.name}, dar nu există cărți disponibile."
            })

        book = random.choice(list(books))
        book_serializer = RecommendedBookSerializer(book)

        # Salvăm rezultatul în profilul userului 
        profile = request.user.profile 
        profile.quiz_result_genre = best_genre 
        profile.quiz_recommended_book = book 
        profile.save()

        return Response({
            "matched_genre": best_genre.name,
            "recommended_book": book_serializer.data
        })
