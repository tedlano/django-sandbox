from django.contrib import admin

# Register your models here.
from .models import Media, Caption, CaptionLine, CaptionLabel, FavoriteMedia

class CaptionInline(admin.StackedInline):
    model = Caption

class CaptionLineAdmin(admin.ModelAdmin):
    inlines = [CaptionInline,]
    

admin.site.register(Media)
admin.site.register(CaptionLine, CaptionLineAdmin)
admin.site.register(Caption)
admin.site.register(FavoriteMedia)
admin.site.register(CaptionLabel)