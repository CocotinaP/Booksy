from django.db import models

class RentalHistory(models.Model):
    user_profile = models.ForeignKey('booksy_server.UserProfile', on_delete=models.CASCADE, related_name='history')

    book = models.ForeignKey('booksy_server.Book', on_delete=models.CASCADE)

    rented_at = models.DateTimeField(auto_now_add=True)
    returned_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Istoric: {self.user_profile.user.username} -> {self.book.title}"