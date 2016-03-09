from __future__ import unicode_literals

from django.db import models
from django.forms import ModelForm
from django.contrib.auth.models import User


class Category(models.Model):
    title = models.CharField(max_length=255)
    color = models.CharField(max_length=6)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order',]
    
    def __str__(self):
        return self.title


class Activity(models.Model):
    category = models.ForeignKey(Category)
    title = models.CharField(max_length=255)
    description = models.TextField()
    order = models.IntegerField(default=0)
    link = models.CharField(max_length=255)
    
    class Meta:
        ordering = ['order',]
        
    def __str__(self):
        return self.title

        
class Log(models.Model):
    activity = models.ForeignKey(Activity)
    duration = models.IntegerField()
    created_at = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(blank=True, default='')
    
    class Meta:
        ordering = ['-created_at',]
        
    def __str__(self):
        return self.comment

        
class LogTimer(models.Model):
    log = models.ForeignKey(Log)
    action = models.BooleanField() # 1=start/resume, 0=pause
    action_time = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-action_time',]


class UserProfile(models.Model):
    user = models.OneToOneField(User)
    
    #Additional Fields
    bio = models.TextField(blank=True, default='')
    allow_edit = models.BooleanField(default=True)
    
    def __str__(self):
        return self.user.username
        
        
        
        
        
        