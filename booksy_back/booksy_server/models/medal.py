from django.db import models


class Medal(models.Model):
    """
    Reprezintă o medalie / achievement configurabil.
    """

    # Tipul acțiunii care generează progres
    # ex: "messages_sent", "games_won", "days_logged_in"
    ACTION_TYPES = [
        ("messages_sent", "Messages Sent"),
        ("books_published", "Books Published"),
        ("books_rented", "Books Rented"),
        # aici mai poți adăuga ulterior alte tipuri
    ]

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    # ce metrică urmărește medalia
    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)

    # pragul necesar pentru a obține medalia
    threshold = models.PositiveIntegerField()

    # dacă medalia poate fi câștigată de mai multe ori
    is_repeatable = models.BooleanField(default=False)

    # opțional: un icon / imagine statică
    icon = models.ImageField(upload_to="medals/", blank=True, null=True)

    # timestamp-uri utile
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Medal"
        verbose_name_plural = "Medals"
        ordering = ["threshold"]

    def __str__(self):
        return f"{self.name} (for {self.action_type}, threshold {self.threshold})"
