from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import Group

from .forms import LoginForm, RegistrationForm

import json

def home(request):
    return render(request, 'home.html')
    
def numbers_quiz(request):
    return render(request, 'numbers_quiz.html')
    
def nibuzhidaodeshi(request):
    return render(request, 'nibuzhidaodeshi.html');
    
def login_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                # Redirect to a success page.
        # form = LoginForm(data=request.POST)
        
        # if form.is_valid():
        #     username = request.POST['username']
        #     password = request.POST['password']
        #     user = authenticate(username=username, password=password)
        #     login(request, user)
    
        #     if user:
        #         # the password verified for the user
        #         if user.is_active:
        #             print("User is valid, active and authenticated")
        #         else:
        #             print("The password is valid, but the account has been disabled!")
        #     else:
        #         # the authentication system was unable to verify the username and password
        #         print("The username and password were incorrect.")
        # else:
        #     print(form.errors)
        #     form = LoginForm()
        
    return HttpResponseRedirect('/')


def logout_user(request):
    logout(request)
    return HttpResponseRedirect('/')


def registration(request):
    if request.method == 'POST':
        form = RegistrationForm(data=request.POST)
        
        if form.is_valid():
            user = form.save()
            username = user.username
            password = user.password
            user.set_password(user.password)
            
            # If first name is blank, set it to "Your Majesty"
            if not user.first_name:
                user.first_name = "Your Majesty"
            
            user.save()
            group = Group.objects.get(name='Caption Makers')
            user.groups.add(group)
            
            user = authenticate(username=username, password=password)
            login(request, user)
            
        return HttpResponseRedirect('/')
    
    else:
        form = RegistrationForm()
        
    response = {
        'form': form
    }
    
    return render(request, 'registration.html', response)