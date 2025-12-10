from rest_framework import serializers, viewsets, permissions
from ..models import BookAnnouncement
from ..services.stats_service import increment_user_stat

from rest_framework.decorators import action
from rest_framework.response import Response

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



    @action(detail=False, methods=['get'], url_path='my-announcements')
    def my_announcements(self, request):
        """
        Returnează toate anunțurile create de user-ul logat
        """
        qs = BookAnnouncement.objects.filter(publisher=request.user).order_by('-created_at')
        serializer = self.get_serializer(qs, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='others-announcements')
    def others_announcements(self, request):
        """
        Returnează toate anunțurile **care nu aparțin user-ului logat**
        """
        qs = BookAnnouncement.objects.exclude(publisher=request.user).order_by('-created_at')
        serializer = self.get_serializer(qs, many=True, context={'request': request})
        return Response(serializer.data)