from django.db import models
from .user import User

class BookAnnouncement(models.Model):
    publisher = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='book_announcements'
    )
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Anunț: {self.title} de {self.author} (publicat de {self.publisher})"