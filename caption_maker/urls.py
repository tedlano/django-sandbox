from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^new$', views.create_new, name='create_new'),
    url(r'^$', views.home, name='home'),
    # url(r'^register/$', views.register, name='register'),
]