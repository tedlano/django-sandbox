from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

from .models import Media, Caption, CaptionLine, FavoriteMedia
from .forms import UserForm

import json, re


def login_register(request):
    if request.method=='POST':
        form = UserForm(request.POST)
    
    if form.is_valid():
        user = User.objects.create_user(username=form.cleaned_data['username'], email = form.cleaned_data['email'], password = form.cleaned_data['password'])
        user.save()
        launchers = user.get_profile()
        launchers.name = form.cleaned_data['name']
        launchers.save()
        response = {'valid': True}
    else:
        response = {'valid': False}
    
    return HttpResponse(json.dumps(response), content_type='application/json')

    
def user_login(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    
    if user is not None:
        if user.is_active:
            login(request, user)
            message = ''.join(["Welcome ", user.first_name, "!"])
        else:
            message = "Username not found, please try again!"
    
    else:
        message = "Invalid login credentials, please try again!"
    
    response = {
        'message': message
    }
    
    return HttpResponse(json.dumps(response), content_type='application/json')


def home(request):
    response = {}
    return render(request, 'caption_maker/home.html', response)


def create_new(request):
    response = {
        'action': 'new'
    }
    
    return render(request,  'caption_maker/create_new.html', response)


def favorite_media(request):
    data = request.POST
    
    try:
        favorite = FavoriteMedia.objects.get(media_id = data['media_id'], user_id = request.user)
        favorite.delete()
    except FavoriteMedia.DoesNotExist:
        favorite = FavoriteMedia(media_id = data['media_id'], user= request.user)
        favorite.save()
    
    response = {
        'hello': 'hello'
    }
    
    return HttpResponse(json.dumps(response), content_type='application/json')


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
    
    response = {
        'action': 'modify',
        'media': media,
        'labels': labelArr,
        'caption_lines': captionLines,
        'captions': captionArr,
        'timeList': timeList
    }
    
    return render(request, 'caption_maker/create_new.html', response)


def media_list(request):
    media_list = Media.objects.all()
    
    if request.user.is_authenticated():
        favorite_media_ids = FavoriteMedia.objects.filter(user=request.user).values_list('media_id', flat=True)
    else:
        favorite_media_ids = []
    
    response = {
        'media_list': media_list,
        'favorite_media_ids': favorite_media_ids
    }
    
    return render(request, 'caption_maker/media_list.html', response)


def submit_captions(request):
    if request.method == 'POST':
        data = request.POST
        
        if data['start_time']:
            start_time = data['start_time']
        else:
            start_time = None
        
        if data['end_time']:
            end_time = data['end_time']
        else:
            end_time = None
        
        if data['action'] == "new":
            media = Media(media_type=data['mediaType'], reference_id=data['refId'], title=data[
                          'title'], author=data['author'], description=data['description'],
                          start_time=start_time, end_time=end_time, created_by=request.user)
        else:
            media = get_object_or_404(Media, pk=data['media_pk'])
            media.title = data['title']
            media.author = data['author']
            media.description = data['description']
            
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
        response = {
            'media': media,
            'captionLines': captionLines,
            'timeList': timeList,
            'labelList': json.dumps(labelList)
        }
    
    return render(request, 'caption_maker/media_detail.html', response)
