from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction
from django.db.models import Q

from ..models import BookAnnouncementResponse, BookAnnouncement, Notification
from ..serializers import BookAnnouncementResponseSerializer


class BookAnnouncementResponseViewSet(viewsets.ModelViewSet):
    queryset = BookAnnouncementResponse.objects.all().order_by('-created_at')
    serializer_class = BookAnnouncementResponseSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        """
        La creare, responder-ul este user-ul logat.
        Se include și câmpul message dacă este trimis.
        """
        # 1. Extrage anunțul din datele trimise (de obicei vine ca ID în request.data)
        announcement_id = self.request.data.get('announcement')
        
        # 2. Verifică dacă există deja un răspuns acceptat pentru acest anunț
        already_accepted = BookAnnouncementResponse.objects.filter(
            announcement_id=announcement_id, 
            status='accepted'
        ).exists()

        if already_accepted:
            raise ValidationError(
                {"detail": "Acest anunț nu mai acceptă răspunsuri deoarece un alt răspuns a fost deja acceptat."}
            )

        resp = serializer.save(responder=self.request.user,
                               message=self.request.data.get('message', None)
        )
        
        # 🔔 Notificare pentru publisher-ul anunțului
        Notification.objects.create(
            user=resp.announcement.publisher,
            type="NEW_RESPONSE",
            message=f"{self.request.user.username} a răspuns la anunțul tău pentru cartea '{resp.announcement.title}'."
        )

    @action(detail=False, methods=['get'], url_path='announcement/(?P<announcement_pk>[^/.]+)', 
            permission_classes=[permissions.IsAuthenticated])
    def for_announcement(self, request, announcement_pk=None):
        """
        GET /api/bookresponses/announcement/{announcement_pk}/
        Returnează toate răspunsurile pentru anunțul dat.
        """
        try:
            announcement = BookAnnouncement.objects.get(pk=announcement_pk)
        except BookAnnouncement.DoesNotExist:
            return Response({'detail': 'Announcement not found'}, status=status.HTTP_404_NOT_FOUND)

        qs = announcement.responses.all().order_by('-created_at')

        # doar publisher-ul vede toate răspunsurile
        if request.user != announcement.publisher:
            qs = qs.filter(Q(status='accepted') | Q(responder=request.user))

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='accept')
    def accept(self, request, pk=None):
        """
        POST /api/bookresponses/{pk}/accept/
        Doar publisher-ul anunțului poate accepta un răspuns.
        """
        resp = self.get_object()

        if resp.announcement.publisher != request.user:
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

        if resp.status == 'accepted':
            return Response({'detail': 'Already accepted'}, status=status.HTTP_400_BAD_REQUEST)

        # acceptă răspunsul și respinge celelalte
        with transaction.atomic():
            resp.status = 'accepted'
            resp.save()

            BookAnnouncementResponse.objects.filter(
                announcement=resp.announcement
            ).exclude(pk=resp.pk).update(status='rejected')

        serializer = self.get_serializer(resp)

        Notification.objects.create(
            user=resp.responder,
            type="RESPONSE_ACCEPTED",
            message=f"Răspunsul tău la anunțul pentru '{resp.announcement.title}' a fost acceptat."
        )

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='reject')
    def reject(self, request, pk=None):
        """
        POST /api/bookresponses/{pk}/reject/
        Doar publisher-ul anunțului poate respinge un răspuns.
        """
        resp = self.get_object()

        if resp.announcement.publisher != request.user:
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

        if resp.status == 'rejected':
            return Response({'detail': 'Already rejected'}, status=status.HTTP_400_BAD_REQUEST)

        resp.status = 'rejected'
        resp.save()

        Notification.objects.create(
            user=resp.responder,
            type="RESPONSE_REJECTED",
            message=f"Răspunsul tău la anunțul pentru '{resp.announcement.title}' a fost respins."
        )
        serializer = self.get_serializer(resp)
        return Response(serializer.data, status=status.HTTP_200_OK)
