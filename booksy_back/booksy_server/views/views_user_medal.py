from rest_framework import viewsets, permissions
from booksy_server.models import UserMedal
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
        user = getattr(self.request, "user", None)

        # când generează schema (swagger) sau user-ul nu e logat:
        if user is None or not user.is_authenticated:
            return UserMedal.objects.none()

        return (
            UserMedal.objects
            .filter(user=user)
            .select_related("medal")
            .order_by("-is_unlocked", "medal__threshold")
        )
