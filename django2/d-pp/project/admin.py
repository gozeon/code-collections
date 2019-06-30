from django.contrib import admin

# Register your models here


from .models import One, Two, People, Card, Publication, Book


admin.site.register(Two)
admin.site.register(People)
admin.site.register(Card)
admin.site.register(Publication)
admin.site.register(Book)

@admin.register(One)
class OneAdmin(admin.ModelAdmin):
    list_display = ('id', 'oname', 'oage', 'odate')
    list_filter = ('oname', 'oage', 'odate')
    list_per_page = 50
    date_hierarchy = 'odate'