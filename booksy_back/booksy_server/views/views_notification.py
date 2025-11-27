from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models.notification import Notification
from ..serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet pentru notificări:
    - GET /notifications/ -> toate notificările userului curent
    - GET /notifications/unread/ -> doar notificările necitite
    - PUT /notifications/{id}/mark-read/ -> marchează ca citită
    - DELETE /notifications/{id}/ -> șterge notificarea
    - POST /notifications/create/ -> creează manual o notificare nouă
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # doar notificările userului curent
        return Notification.objects.filter(user=self.request.user).order_by("-created_at")

    @action(detail=False, methods=["get"], url_path="unread")
    def unread(self, request):
        """
        Returnează notificările necitite pentru userul curent
        """
        qs = Notification.objects.filter(user=request.user, is_read=False).order_by("-created_at")
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["put"], url_path="mark-read")
    def mark_read(self, request, pk=None):
        """
        Marchează notificarea ca citită
        """
        notif = self.get_object()
        notif.is_read = True
        notif.save()
        return Response({"status": "read"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="create")
    def create_notification(self, request):
        """
        Creează manual o notificare nouă (ex. pentru testare sau mesaje custom).
        Body JSON:
        {
          "user": <user_id>,
          "type": "NEW_MESSAGE",
          "message": "Ai primit un mesaj nou!"
        }
        """
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
