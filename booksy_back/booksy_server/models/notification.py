from django.db import models
from .user import User


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('NEW_MESSAGE', 'New Message'),
        ('NEW_REQUEST', 'New Request'),
        ('REQUEST_ACCEPTED', 'Request Accepted'),
        ('REQUEST_REJECTED', 'Request Rejected'),
        ('REQUEST_RETURNED', 'Book Returned'),
        ('REQUEST_CANCELED', "Recuest Canceled"),
        ('FEEDBACK_RECEIVED', 'Feedback Received'),
        ('NEW_RESPONSE', 'New Response'),
        ('RESPONSE_ACCEPTED', 'Response Accepted'),        
        ('RESPONSE_REJECTED', 'Response Rejected'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notificare pentru {self.user.username} - {self.get_type_display()}"