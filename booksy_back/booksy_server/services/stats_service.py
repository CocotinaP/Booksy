from django.core.exceptions import ObjectDoesNotExist
from ..models import UserStats

def get_or_create_user_stats(user):
    """
    Returnează UserStats pentru user; dacă nu există, îl creează.
    """
    stats, _ = UserStats.objects.get_or_create(user=user)
    return stats

def increment_user_stat(user, stat_name, amount=1):
    """
    Crește o anumită statistică a utilizatorului în mod safe.
    Creează UserStats dacă nu există încă.
    """
    stats = get_or_create_user_stats(user)

    current_value = getattr(stats, stat_name, 0)
    setattr(stats, stat_name, current_value + amount)
    stats.save()

    return getattr(stats, stat_name)
