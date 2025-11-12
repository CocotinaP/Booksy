from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomTokenObtainPairView, HelloWorldView, BookViewSet
from rest_framework_simplejwt.views import TokenRefreshView
from .views.views_logout import LogoutView
from .views.views_register import RegisterView

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='books')

urlpatterns = [
    path('', HelloWorldView.as_view(), name='hello_world'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout', LogoutView.as_view(), name="logout"),
    path('', include(router.urls)),   # aici se includ rutele generate de router
]