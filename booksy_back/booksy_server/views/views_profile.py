from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404

from ..models import UserProfile, RentalHistory, Genre, Author
from ..serializers import UserProfileSerializer, RentalHistorySerializer, GenreSerializer, \
    AuthorSerializer


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get_profile(self, user):
        # Helper method: Cauta profilul sau il creeaza daca nu există
        profile, created = UserProfile.objects.get_or_create(user=user)
        return profile

    def get(self, request):
        """ Returneaza profilul utilizatorului logat """
        profile = self.get_profile(request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        """ Actualizeaza preferințele (Genuri, Autori) """
        profile = self.get_profile(request.user)

        # 'partial=True' permite actualizarea doar a unor câmpuri (ex: doar genurile)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """ Returneaza istoricul de lectura al utilizatorului logat """
        # Filtram istoricul legat de profilul userului curent
        history = RentalHistory.objects.filter(user_profile__user=request.user).order_by('-rented_at')
        serializer = RentalHistorySerializer(history, many=True)
        return Response(serializer.data)


class OptionsView(APIView):
    def get(self, request):
        genres = Genre.objects.all()
        authors = Author.objects.all()

        return Response({
            "genres": GenreSerializer(genres, many=True).data,
            "authors": AuthorSerializer(authors, many=True).data
        })