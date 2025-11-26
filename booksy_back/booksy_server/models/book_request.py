from django.db import models
from .user import User
from .book import Book


class BookRequest(models.Model):
    requester = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='book_requests_made'
    )
    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name='rental_requests'
    )
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('accepted', 'Accepted'),
            ('rejected', 'Rejected'),
            ('returned', 'Returned'),
            ('canceled', 'Canceled')
        ],
        default='pending'
    )
    message = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.requester} → {self.book.title} ({self.status})"