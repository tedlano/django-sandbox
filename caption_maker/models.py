from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Media(models.Model):
    media_type = models.CharField(max_length = 8)
    reference_id = models.CharField(max_length = 32)
    title = models.CharField(max_length=255)
    author = models.CharField(null=True, max_length=32)
    description = models.TextField(null=True)
    start_time = models.DecimalField(null=True, max_digits=6, decimal_places=1)
    end_time = models.DecimalField(null=True, max_digits=6, decimal_places=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User)
    
    class Meta:
        ordering = ['title',]
    
    def __unicode__(self):
        return unicode(self.title) or u'no title'


class CaptionLine(models.Model):
    media = models.ForeignKey(Media)
    mark_time = models.DecimalField(max_digits=6, decimal_places=1)
    break_after = models.BooleanField(default=False)
    order = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order',]
    
    def __unicode__(self):
        return unicode(self.order) + u' (' + unicode(self.mark_time) + u')' or u'no order'

# TO BE IMPLEMENTED
class CaptionLabel(models.Model):
    label = models.CharField(max_length=32)
    order = models.IntegerField(default=1)
    created_by = models.ForeignKey(User)
    
    class Meta:
        ordering = ['order',]
    
    def __unicode__(self):
        return unicode(self.label) or u'no label'


class Caption(models.Model):
    caption_line = models.ForeignKey(CaptionLine)
    # caption_label = models.ForeignKey(CaptionLabel)
    label = models.CharField(max_length=32) # to remove
    text = models.CharField(max_length=256)
    order = models.IntegerField(default=1)  # to remove

    class Meta:
        ordering = ['label', 'order',]
    
    def __unicode__(self):
        return unicode(self.text) or u'no caption text'


class FavoriteMedia(models.Model):
    media = models.ForeignKey(Media)
    user = models.ForeignKey(User)

