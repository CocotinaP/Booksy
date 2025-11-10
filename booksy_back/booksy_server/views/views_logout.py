from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Selectează toate token-urile asociate utilizatorului curent
            tokens = OutstandingToken.objects.filter(user=request.user)
            for token in tokens:
                # Marchează fiecare token ca blacklisted
                BlacklistedToken.objects.get_or_create(token=token)
            return Response({"detail": "Logout suceeded."})
        except Exception:
            return Response({"detail": "Logout error."}, status=400)
