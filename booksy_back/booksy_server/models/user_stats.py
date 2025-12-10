from django.conf import settings
from django.db import models


class UserStats(models.Model):
    """
    Statistici agregate pentru un utilizator.
    Din aceste câmpuri se calculează progresul la medalii.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="stats",
    )

    # exemplu de metrici urmărite
    messages_sent = models.PositiveIntegerField(default=0)
    books_published = models.PositiveIntegerField(default=0)
    books_rented = models.PositiveIntegerField(default=0)

    # poți adăuga aici alte metrici:
    # comments_posted = models.PositiveIntegerField(default=0)
    # likes_given = models.PositiveIntegerField(default=0)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User Stats"
        verbose_name_plural = "Users Stats"

    def __str__(self):
        return f"Stats for {self.user}"
