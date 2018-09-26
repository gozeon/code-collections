from django.shortcuts import render
from rest_framework import viewsets
from .models import Language, People
from .serializers import LanguageSerializers, PeopleSerializers


class LanguageView(viewsets.ModelViewSet):
    queryset = Language.objects.all().filter(is_delete=False)
    serializer_class = LanguageSerializers


class PeopleView(viewsets.ModelViewSet):
    queryset = People.objects.all().filter(language__is_delete=False)
    serializer_class = PeopleSerializers
