from django.shortcuts import render, get_object_or_404 
from django.http import HttpResponse
from .models import Media, Caption, CaptionLine


def home(request):
    context = {}
    return render(request, 'caption_maker/home.html', context)

def create_new(request):
    context = {}
    return render(request,  'caption_maker/create_new.html', context)