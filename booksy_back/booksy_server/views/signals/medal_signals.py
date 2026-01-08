# achievements/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from ..models import UserStats
from ..services.medal_service import update_user_medals_for_action

@receiver(post_save, sender=UserStats)
def update_medals_when_stats_change(sender, instance, **kwargs):
    user = instance.user
    stats = instance

    update_user_medals_for_action(user, "books_lent", stats.books_lent)
    update_user_medals_for_action(user, "books_published", stats.books_published)
    update_user_medals_for_action(user, "books_rented", stats.books_rented)
