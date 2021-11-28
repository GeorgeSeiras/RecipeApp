from django.contrib.auth import REDIRECT_FIELD_NAME
from django.contrib.auth.decorators import user_passes_test
from functools import wraps

from django.http.response import HttpResponse 
from user.models import User
from rest_framework import status

def user_required(function):
    @wraps(function)
    def wrap(self,request,*args,**kwargs):
        try:
            user = User.objects.get(username=request.user)
            if user.is_active:
                return function(self,request,*args,**kwargs)
            else:
                return HttpResponse('Access Unauthorized',status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
                return HttpResponse('Access Unauthorized',status=status.HTTP_401_UNAUTHORIZED)
    return wrap

def admin_required(function):
    @wraps(function)
    def wrap(self,request,*args,**kwargs):
        try:
            user = User.objects.get(username=request.user)
            if user.is_staff:
                return function(self,request,*args,**kwargs)
            else:
                return HttpResponse('Access Unauthorized',status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
                return HttpResponse('Access Unauthorized',status=status.HTTP_401_UNAUTHORIZED)
    return wrap
    