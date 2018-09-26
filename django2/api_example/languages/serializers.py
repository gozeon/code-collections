from rest_framework import serializers
from .models import Language, People


class LanguageSerializers(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Language
        fields = ('id', 'url', 'name', 'paradigm')


class PeopleSerializers(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = People
        fields = ('id', 'url', 'language')
