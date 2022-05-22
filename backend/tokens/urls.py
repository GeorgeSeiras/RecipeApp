from django.conf.urls import include
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views


urlpatterns = [
    path('verification/new', views.TokenNew.as_view(), name='token-new'),
    path('verification/<str:token>', views.Token.as_view(), name='token'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
