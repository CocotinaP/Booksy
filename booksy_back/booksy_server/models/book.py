from django.db import models
from .user import User

#---Modele pentru alg de recomandare---
class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True) # unique=True ca sa nu ai dubluri
    def __str__(self): return self.name

class Author(models.Model):
    name = models.CharField(max_length=200, unique=True)
    def __str__(self): return self.name

class Book(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='books')
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    genre = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    price_per_day = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    photo = models.ImageField(upload_to='book_photos/', blank=True, null=True)
    available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} by {self.author}"