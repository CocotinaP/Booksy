from rest_framework import serializers, viewsets, permissions
from ..models import BookAnnouncement

class BookAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookAnnouncement
        fields = ['id', 'publisher', 'title', 'author', 'description', 'created_at']

class BookAnnouncementViewSet(viewsets.ModelViewSet):
    queryset = BookAnnouncement.objects.all().order_by('-created_at')
    serializer_class = BookAnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # La creare, publisher-ul va fi user-ul logat
        serializer.save(publisher=self.request.user)