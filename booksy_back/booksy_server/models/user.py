from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    rating = models.FloatField(default=0)
    address = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"


# Modelul nou pentru Cont
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    favorite_genres = models.ManyToManyField('booksy_server.Genre', blank=True, related_name='favored_by')
    favorite_authors = models.ManyToManyField('booksy_server.Author', blank=True, related_name='favored_by')

    quiz_result_genre = models.ForeignKey( 
        "booksy_server.Genre", 
        on_delete=models.SET_NULL, 
        null=True, blank=True, 
        related_name='quiz_results' 
        ) 
    
    quiz_recommended_book = models.ForeignKey( 
        "booksy_server.Book", 
        on_delete=models.SET_NULL, 
        null=True, blank=True, 
        related_name='quiz_recommendations' 
        )

    def __str__(self):
        return f"Profilul lui {self.user.username}"