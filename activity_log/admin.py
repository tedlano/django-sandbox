from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Category, Activity, Log, LogTimer, UserProfile

class ActivityInline(admin.StackedInline):
    model = Activity

class CategoryAdmin(admin.ModelAdmin):
    inlines = [ActivityInline,]
    
class LogInline(admin.StackedInline):
    model = Log
    
class ActivityAdmin(admin.ModelAdmin):
    inlines = [LogInline,]

admin.site.register(UserProfile)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Activity, ActivityAdmin)
admin.site.register(Log)
admin.site.register(LogTimer)