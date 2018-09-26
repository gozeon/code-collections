from django.contrib import admin
from .models import Language, People


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    # list_filter = ['id', 'name', 'paradigm', 'is_delete']
    list_display = ['id', 'name', 'paradigm', 'is_delete']


@admin.register(People)
class PeopleAdmin(admin.ModelAdmin):
    # list_filter = ['id', 'name', 'paradigm', 'is_delete']
    list_display = ['id', 'language_id']