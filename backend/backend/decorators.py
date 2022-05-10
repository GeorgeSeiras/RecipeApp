from django.contrib.auth import REDIRECT_FIELD_NAME
from django.contrib.auth.decorators import user_passes_test
from functools import wraps

from user.models import User
from rest_framework.exceptions import NotAuthenticated, PermissionDenied


def user_not_banned(function):
    @wraps(function)
    def wrap(self, request, *args, **kwargs):
        try:
            user = User.objects.get(username=request.user)
            if user.removed:
                return function(self, request, *args, **kwargs)
            else:
                raise PermissionDenied(
                    {"message": 'Your account has been suspended'})
        except User.DoesNotExist:
            pass
    return wrap


def user_required(function):
    @wraps(function)
    def wrap(self, request, *args, **kwargs):
        try:
            user = User.objects.get(username=request.user)
            if user.is_active:
                return function(self, request, *args, **kwargs)
            else:
                raise NotAuthenticated({"message": 'Access Unauthorized'})
        except User.DoesNotExist:
            raise NotAuthenticated({"message": "Access Unauthorized"})
    return wrap


def admin_required(function):
    @wraps(function)
    def wrap(self, request, *args, **kwargs):
        try:
            user = User.objects.get(username=request.user)
            if user.is_staff:
                return function(self, request, *args, **kwargs)
            else:
                raise NotAuthenticated({"message": 'Access Unauthorized'})
        except User.DoesNotExist:
            raise NotAuthenticated({"message": "Access Unauthorized"})
    return wrap
