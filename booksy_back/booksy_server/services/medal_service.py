# achievements/services.py
from django.utils import timezone
from ..models import Medal, UserMedal

def update_user_medals_for_action(user, action_type, new_value):
    medals = Medal.objects.filter(action_type=action_type)

    for medal in medals:
        um, _ = UserMedal.objects.get_or_create(user=user, medal=medal)
        um.progress = new_value

        if not um.is_unlocked and new_value >= medal.threshold:
            um.is_unlocked = True
            um.unlocked_at = timezone.now()

        um.save()
