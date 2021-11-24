from django.conf.urls import include
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('auth/', include('rest_auth.urls'))
]