from rest_framework import viewsets, permissions
from booksy_server.models import UserMedal, Medal, UserStats
from ..serializers import UserMedalSerializer


class UserMedalViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Returnează lista de medalii + progres pentru user-ul logat.
    - GET /user-medals/           -> toate medaliile user-ului
    - GET /user-medals/<id>/      -> detalii pentru o medalie a user-ului
    """

    serializer_class = UserMedalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # 1. Get user stats (one row per user)
        stats = UserStats.objects.get(user=user)

        # 2. For each Medal, create/update UserMedal with proper progress
        medals = Medal.objects.all()

        for medal in medals:
            # Map action_type -> current value from stats
            if medal.action_type == "books_published":
                current_value = stats.books_published
            elif medal.action_type == "books_rented":
                current_value = stats.books_rented
            elif medal.action_type == "books_lent":
                current_value = stats.books_lent
            else:
                current_value = 0  # default for unknown types

            # progress can’t exceed the threshold for non-repeatable medals
            progress = min(current_value, medal.threshold)
            is_unlocked = progress >= medal.threshold

            user_medal, created = UserMedal.objects.get_or_create(
                user=user,
                medal=medal,
                defaults={
                    "progress": progress,
                    "is_unlocked": is_unlocked,
                },
            )

            # If it already existed, keep it in sync with stats
            if not created and (
                user_medal.progress != progress or user_medal.is_unlocked != is_unlocked
            ):
                user_medal.progress = progress
                user_medal.is_unlocked = is_unlocked
                user_medal.save(update_fields=["progress", "is_unlocked"])

        # 3. Return the queryset for this user
        return (
            UserMedal.objects
            .filter(user=user)
            .select_related("medal")
            .order_by("-is_unlocked", "medal__threshold")
        )
