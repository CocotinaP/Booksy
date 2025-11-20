from django.db import models
from .user import User
from .book_announcement import BookAnnouncement

class BookAnnouncementResponse(models.Model):
    announcement = models.ForeignKey(
        BookAnnouncement,
        on_delete=models.CASCADE,
        related_name='responses'
    )
    responder = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='book_responses'
    )
    image = models.ImageField(upload_to='book_responses/')
    message = models.TextField(
        blank=True,
        null=True,
        help_text="Mesaj opțional al utilizatorului"
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('accepted', 'Accepted'),
            ('rejected', 'Rejected')
        ],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Răspuns de {self.responder} la {self.announcement.title} ({self.status})"