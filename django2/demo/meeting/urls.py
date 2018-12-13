from django.urls import path
from . import views

urlpatterns = [
    path('', views.hello, name='meeting_hello'),
]
