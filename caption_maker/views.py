from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Media, Caption, CaptionLine
import json
import re


def home(request):
    context = {}
    return render(request, 'caption_maker/home.html', context)


def create_new(request):
    context = {}
    return render(request,  'caption_maker/create_new.html', context)


def media_list(request):
    media_list = Media.objects.all()
    context = {
        'media_list': media_list
    }
    return render(request, 'caption_maker/media_list.html', context)


def submit_captions(request):
    if request.method == 'POST':
        data = request.POST

        media = Media(media_type=data['mediaType'], reference_id=data['refId'], title=data['title'], author=data['author'], description=data['description'])
        media.save()

        capList = re.findall(r'\{([^}]*)\}', data['captions'])
        
        for cap in capList:
            c = json.loads("{" + cap + "}")
            
            captionLine = CaptionLine(media=media, mark_time=c['time'],  order=c['order'], break_after=c['break_after'])
            captionLine.save()
            
            caption = Caption(caption_line=captionLine, order=1, label=data['capLabel'], text=c['text'])
            caption.save()
    
    return HttpResponse(request)


def media_detail(request, media_pk):
    media = get_object_or_404(Media, pk=media_pk)
    captionLines = CaptionLine.objects.filter(media_id=media_pk)
    print(captionLines)
    timeList = []

    for capLine in captionLines:
        timeList.append(float(capLine.mark_time))

    print(timeList)
    context = {
        'media': media,
        'captionLines': captionLines,
        'timeList': timeList
    }
    return render(request, 'caption_maker/media_detail.html', context)
