from django.urls import path
from .views import CustomTokenObtainPairView,HelloWorldView
from rest_framework_simplejwt.views import TokenRefreshView
from .views.views_logout import LogoutView

urlpatterns = [
    path('', HelloWorldView.as_view(), name='hello_world'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout', LogoutView.as_view(), name="logout"),
]