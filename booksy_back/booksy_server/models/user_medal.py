from django.conf import settings
from django.db import models


class UserMedal(models.Model):
    """
    Progresul unui utilizator pentru o anumită medalie.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_medals",
    )

    medal = models.ForeignKey(
        "Medal",   # sau `app_label.Medal` dacă e în alt app
        on_delete=models.CASCADE,
        related_name="user_medals",
    )

    # progresul curent pentru medalia respectivă
    # poți salva absolut (ex: 37 din 100)
    progress = models.PositiveIntegerField(default=0)

    # dacă medalia a fost deblocată
    is_unlocked = models.BooleanField(default=False)
    unlocked_at = models.DateTimeField(blank=True, null=True)

    # util pentru medalii repeatable (ex: "X wins per season")
    # times_earned = models.PositiveIntegerField(default=0)

    last_progress_update = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User Medal"
        verbose_name_plural = "User Medals"
        unique_together = ("user", "medal")

    def __str__(self):
        status = "unlocked" if self.is_unlocked else "in progress"
        return f"{self.user} - {self.medal} ({status})"

    @property
    def progress_percent(self) -> float:
        """
        Returnează progresul ca procent (0-100).
        Ai nevoie de threshold-ul de pe medalie.
        """
        if self.medal.threshold == 0:
            return 100.0
        return min(100.0, (self.progress / self.medal.threshold) * 100)
