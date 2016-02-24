from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'(?P<category_pk>\d+)/(?P<activity_pk>\d+)/$', views.activity_detail, name='activity_detail'),
    url(r'^play_pause_click/$', views.play_pause_click, name='play_pause_click'),
    url(r'(?P<pk>\d+)/$', views.activity_list, name='activity_list'),
    url(r'^$', views.home, name='home'),
    # url(r'^register/$', views.register, name='register'),
]