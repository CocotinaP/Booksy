from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from ..models.book_request import BookRequest
from ..serializers import BookRequestSerializer
from ..models.notification import Notification

class BookRequestViewSet(viewsets.ModelViewSet):
    queryset = BookRequest.objects.all()
    serializer_class = BookRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        book_request = serializer.save(requester=self.request.user)
        Notification.objects.create(
            user=book_request.book.owner,
            type="NEW_REQUEST",
            message=f"{self.request.user.username} a trimis o cerere pentru cartea '{book_request.book.title}'."
        )

    @action(detail=False, methods=['get'], url_path='sent')
    def sent(self, request):
        requests = BookRequest.objects.filter(requester=request.user)
        serializer = self.get_serializer(requests, many=True)
        data = serializer.data
        if not data:
            return Response({"message": "No sent books requests found.", "results": []})
        return Response(data)

    @action(detail=False, methods=['get'], url_path='received')
    def received(self, request):
        requests = BookRequest.objects.filter(book__owner=request.user)
        serializer = self.get_serializer(requests, many=True)
        data = serializer.data
        if not data:
            return Response({"message": "No received books requests found.", "results": []})
        return Response(data)

    @action(detail=True, methods=['put'], url_path='accept')
    def accept(self, request, pk=None):
        book_request = self.get_object()
        if book_request.book.owner != request.user:
            return Response({'error': 'Not authorized'}, status=403)
        book_request.status = 'accepted'
        book_request.save()

        Notification.objects.create(
        user=book_request.requester,
        type="REQUEST_ACCEPTED",
        message=f"Cererea ta pentru '{book_request.book.title}' a fost acceptată."
        )

        return Response({'status': 'accepted'})

    @action(detail=True, methods=['put'], url_path='reject')
    def reject(self, request, pk=None):
        book_request = self.get_object()
        if book_request.book.owner != request.user:
            return Response({'error': 'Not authorized'}, status=403)
        book_request.status = 'rejected'
        book_request.save()

        Notification.objects.create(
        user=book_request.requester,
        type="REQUEST_REJECTED",
        message=f"Cererea ta pentru '{book_request.book.title}' a fost refuzată."
        )
        
        return Response({'status': 'rejected'})
    
    @action(detail=True, methods=['put'], url_path='cancel')
    def cancel(self, request, pk=None):
        book_request = self.get_object()
        user_to_penalize = book_request.requester
        
        if user_to_penalize != request.user:
            return Response(
                {'error': 'Not authorized.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        if book_request.status in ['rejected', 'returned', 'canceled']:
            return Response(
                {'error': f"The book request cannot be canceled because the current status is '{book_request.status}'."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # VERIFICARE TERMEN LIMITĂ (Aplicabilă pentru 'pending' ȘI 'accepted')
        today = timezone.now().date()
        cancellation_deadline = book_request.start_date - timedelta(days=3)

        if today > cancellation_deadline:
             return Response(
                {
                    'error': f"Cancellation of the request is no longer allowed. You must cancel at least 3 days before the start of the rental period. The deadline has been {cancellation_deadline}."
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
                
        is_accepted = book_request.status == 'accepted'
        
        book_request.status = 'canceled'
        book_request.save()

        # Aplicare Penalizare DOAR dacă a fost ACCEPTED anterior
        if is_accepted:
            PENALTY_AMOUNT = 5.0 
            
            user_to_penalize.rating = max(0.0, user_to_penalize.rating - PENALTY_AMOUNT)
            user_to_penalize.save()
            
            message = f"The request has been canceled. You have received a penality of {PENALTY_AMOUNT} points to your trust rating ({user_to_penalize.rating})."
        else:
            message = "The pending request has been canceled."

        # 🔔 Notificare pentru proprietarul cărții
        Notification.objects.create(
            user=book_request.book.owner,
            type="REQUEST_CANCELED",
            message=f"{request.user.username} a anulat cererea pentru cartea '{book_request.book.title}'."
        )

        return Response(
            {
                'status': 'canceled', 
                'message': message
            }, 
            status=status.HTTP_200_OK
        )