from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from .models import Media, Caption, CaptionLine
import json, re


def home(request):
    context = {}
    return render(request, 'caption_maker/home.html', context)


def create_new(request):
    context = {
        'action': 'new'
    }
    return render(request,  'caption_maker/create_new.html', context)


def modify_media(request, media_pk):
    media = get_object_or_404(Media, pk=media_pk)
    captionLines = CaptionLine.objects.filter(media_id=media_pk)
    labelArr = [];
    captionArr = [];
    timeList = [];
    
    for idx1, capLine in enumerate(captionLines):
        timeList.append(float(capLine.mark_time));
        for idx2, cap in enumerate(capLine.caption_set.all()):
            if(idx1 == 0):
                # Create new list to hold captions grouped by label (eg: English)
                captionArr.append([])
                labelArr.append(cap.label)

            # Append caption into appropriate caption list
            captionArr[idx2].append(cap)
            if capLine.break_after:
                captionArr[idx2].append("")
    
    context = {
        'action': 'modify',
        'media': media,
        'labels': labelArr,
        'caption_lines': captionLines,
        'captions': captionArr,
        'timeList': timeList
    }
    
    return render(request, 'caption_maker/create_new.html', context)

def media_list(request):
    media_list = Media.objects.all()
    context = {
        'media_list': media_list
    }
    return render(request, 'caption_maker/media_list.html', context)


def submit_captions(request):
    if request.method == 'POST':
        data = request.POST
        
        if data['action'] == "new":
            media = Media(media_type=data['mediaType'], reference_id=data['refId'], title=data[
                          'title'], author=data['author'], description=data['description'],
                          start_time=data['start_time'], end_time=data['end_time'])
        else:
            media = get_object_or_404(Media, pk=data['media_pk'])
            media.title = data['title']
            media.author = data['author']
            media.description = data['description']
            start_time = data['start_time']
            end_time = data['end_time']
            
            CaptionLine.objects.filter(media_id=data['media_pk']).delete()
        
        media.save()
        
        capList = re.findall(r'\{([^}]*)\}', data['captions'])
        capLines = json.loads(data['captionLines'])

        for idx1, cap in enumerate(capList):
            c = json.loads("{" + cap + "}")
            
            captionLine = CaptionLine(media=media, mark_time=c['time'],  order=c[
                                      'order'], break_after=c['break_after'])
            captionLine.save()

            for idx2, key in enumerate(capLines):
                caption = Caption(caption_line=captionLine,
                                  order=idx2, label=key, text=capLines[key][idx1])
                caption.save()
        
        response = {
            'url': '/caption_maker/' + str(media.id)
        }
    return HttpResponse(json.dumps(response), content_type='application/json')


def media_detail(request, media_pk):
    if request.method == 'GET':
        media = get_object_or_404(Media, pk=media_pk)
        captionLines = CaptionLine.objects.filter(media_id=media_pk)
        timeList = []
    
        for capLine in captionLines:
            timeList.append(float(capLine.mark_time))
    
        labelList = list(Caption.objects.filter(caption_line__in=captionLines).values_list('label', flat=True).distinct())
        print(labelList)
        context = {
            'media': media,
            'captionLines': captionLines,
            'timeList': timeList,
            'labelList': json.dumps(labelList)
        }
    
    return render(request, 'caption_maker/media_detail.html', context)
