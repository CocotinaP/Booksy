from django.urls import path
from .views.hello_world import HelloWorldView

urlpatterns = [
    path('', HelloWorldView.as_view(), name='hello_world'),
]