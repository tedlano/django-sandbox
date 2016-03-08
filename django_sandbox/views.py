from django.shortcuts import render, get_object_or_404 

def home(request):
    return render(request, 'home.html')
    
def numbers_quiz(request):
    return render(request, 'numbers_quiz.html')
    
def nibuzhidaodeshi(request):
    return render(request, 'nibuzhidaodeshi.html');