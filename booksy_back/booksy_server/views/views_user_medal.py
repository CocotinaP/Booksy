from rest_framework import viewsets, permissions
from booksy_server.models import UserMedal, Medal
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

        medals = Medal.objects.all()

        for medal in medals:
            UserMedal.objects.get_or_create(
                user=user,
                medal=medal,
                defaults={
                    "progress": 0,
                    "is_unlocked": False,
                }
            )

        return (
            UserMedal.objects
            .filter(user=user)
            .select_related("medal")
            .order_by("-is_unlocked", "medal__threshold")
        )
