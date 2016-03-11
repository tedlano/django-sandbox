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

        media = Media(media_type=data['mediaType'], reference_id=data[
                      'refId'], title=data['title'])
        media.save()

        caption = Caption(media=media, label=data['capLabel'])
        caption.save()

        capList = re.findall(r'\{([^}]*)\}', data['captions'])

        for cap in capList:
            c = json.loads("{" + cap + "}")
            captionLine = CaptionLine(caption=caption, order=c['order'], mark_time=c[
                                      'time'], text=c['text'], break_after=c['break_after'])
            captionLine.save()

    return HttpResponse(request)


def media_detail(request, media_pk):
    media = get_object_or_404(Media, pk=media_pk)
    caption = get_object_or_404(Caption, media_id=media_pk)
    timeList = []

    for cap in caption.captionline_set.all():
        timeList.append(float(cap.mark_time))

    print(timeList)
    context = {
        'media': media,
        'caption': caption,
        'timeList': timeList
    }
    return render(request, 'caption_maker/media_detail.html', context)
