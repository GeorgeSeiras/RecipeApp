
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from . import views

urlpatterns = [
    path('notifications',views.NotificationsView.as_view(), name='notifications'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
