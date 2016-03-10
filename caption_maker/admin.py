from django.contrib import admin

# Register your models here.
from .models import Media, Caption, CaptionLine

class CaptionLineInline(admin.StackedInline):
    model = CaptionLine

class CaptionAdmin(admin.ModelAdmin):
    inlines = [CaptionLineInline,]
    

admin.site.register(Media)
admin.site.register(Caption, CaptionAdmin)
admin.site.register(CaptionLine)