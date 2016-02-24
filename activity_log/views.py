from django.shortcuts import render, get_object_or_404 
from django.http import HttpResponse
from .models import Category, Activity, Log, LogTimer
from datetime import datetime


def home(request):
    categories = Category.objects.all()
    context = {
        'categories': categories
    }
    return render(request, 'activity_log/home.html', context)


def activity_list(request, pk):
    category = get_object_or_404(Category, pk=pk)
    context = {
        'category': category
    }
    return render(request,  'activity_log/activity_list.html', context)


def play_pause_click(request):
    
    if request.method == 'POST':
        data = request.GET
        activity_pk = data['activity_pk']
        activeLog = Log.objects.filter(activity_id=activity_pk, created_at__isnull=True)
        
        if activeLog:
            activeLog = activeLog[0]

        else:
            activeLog = Log(comment=data['comment'], duration=data['duration'], activity_id=activity_pk)
            activeLog.save()
        
        # create a LogTimer object to track play/pause clicks
        logTimerBool = data['play_pause'] # True=play, False=pause
        logTimer = LogTimer(log=activeLog, action=logTimerBool)
        logTimer.save()

    return HttpResponse(request)

def add_new_log(request):
    
    # if no active log is present, create new
    if activeLog is None:
        activeLog = Log(comment=data['comment'], duration=dur, activity=activity, created_at=datetime.now())
        activeLog.save()
    
    # else edit existing active log
    else:
        activeLog.comment = data['comment']
        activeLog.duration = dur
        activeLog.created_at = datetime.now()
        activeLog.save()
    
    logs = getLogs(activity_pk)

    context = {
        'activity': activity,
        'logs': logs,
    }
    
    return render(request, 'activity_log/activity_detail.html', context)
    

def activity_detail(request, category_pk, activity_pk):
    
    # Get all Log entries for given activity
    def getLogs(activity_pk):
        try:
            logs = Log.objects.filter(activity_id=activity_pk, created_at__isnull=False)
            
            # Change display of datetime variables
            for log in logs:
                log.created_at = log.created_at.strftime("%Y-%m-%d %H:%M")
                hours = log.duration // 60
                minutes = log.duration % 60
                log.duration = "%d:%02d" % (hours, minutes)
            
        except Log.DoesNotExist:
            logs = None
            
        return logs
    
    # Get activity from DB, Form object, and Log entries
    activity = get_object_or_404(Activity, category_id=category_pk, pk=activity_pk)
    logs = getLogs(activity_pk)
    
    # if form has been submitted
    if request.method == "POST":
        data = request.POST
        
        # for key in data:
        #     value = data[key]
        #     print("key: %s, value: %s" % (key,value))

        activeLog = Log.objects.filter(activity_id=activity_pk, created_at__isnull=True)
        
        hours = int(data['hour'])
        minutes = int(data['min'])
        seconds = int(data['sec'])
        
        if seconds >= 30:
            minutes = minutes + 1
        
        dur = hours * 60 + minutes
        
        # if no active log is present, create new
        if activeLog is None:
            activeLog = Log(comment=data['comment'], duration=dur, activity=activity, created_at=datetime.now())
            activeLog.save()
        
        # else edit existing active log
        else:
            activeLog.comment = data['comment']
            activeLog.duration = dur
            activeLog.created_at = datetime.now()
            activeLog.save()

        logs = getLogs(activity_pk)

    context = {
        'activity': activity,
        'logs': logs,
    }
    
    return render(request, 'activity_log/activity_detail.html', context)
    
    
    