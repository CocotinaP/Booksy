from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

# 1. IMPORTĂM serializer-ul modificat din fișierul central serializers.py
from ..serializers import BookAnnouncementSerializer
from ..models import BookAnnouncement


class BookAnnouncementViewSet(viewsets.ModelViewSet):
    queryset = BookAnnouncement.objects.all().order_by('-created_at')
    serializer_class = BookAnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
       serializer.save(publisher=self.request.user)

    @action(detail=False, methods=['get'], url_path='my-announcements')
    def my_announcements(self, request):
        """
        Returnează toate anunțurile create de user-ul logat
        """
        qs = BookAnnouncement.objects.filter(publisher=request.user).order_by('-created_at')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='others-announcements')
    def others_announcements(self, request):
        """
        Returnează toate anunțurile **care nu aparțin user-ului logat**
        """
        qs = BookAnnouncement.objects.exclude(publisher=request.user).order_by('-created_at')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)