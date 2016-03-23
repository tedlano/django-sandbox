from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'(?P<media_pk>\d+)/$', views.media_detail, name='media_detail'),
    url(r'^new$', views.create_new, name='create_new'),
    url(r'^modify/(?P<media_pk>\d+)$', views.modify_media, name='modify_media'),
    url(r'^submit_captions/$', views.submit_captions, name='submit_captions'),
    url(r'^media_list$', views.media_list, name='media_list'),
    # url(r'^login/$','django.contrib.auth.views.login', name='login',
    #     kwargs={'template_name': 'accounts/login.html'}),
    url(r'^login_register$', views.login_register, name='login_register'),
    url(r'^$', views.home, name='home'),
    # url(r'^register/$', views.register, name='register'),
]
