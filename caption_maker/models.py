from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Media(models.Model):
    media_type = models.CharField(max_length = 8)
    reference_id = models.CharField(max_length = 32)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=6)
    description = models.TextField()
    start_time = models.DecimalField(max_digits=6, decimal_places=1)
    end_time = models.DecimalField(max_digits=6, decimal_places=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['title',]
    
    def __str__(self):
        return self.title


class Caption(models.Model):
    media = models.ForeignKey(Media)
    label = models.CharField(max_length=32)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['order',]
        
    def __str__(self):
        return self.label

        
class CaptionLine(models.Model):
    caption = models.ForeignKey(Caption)
    order = models.IntegerField(default=0)
    text = models.CharField(max_length=256)
    
    class Meta:
        ordering = ['order',]
        
    def __str__(self):
        return self.text