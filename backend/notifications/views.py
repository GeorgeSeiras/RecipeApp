from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied
from django.db import transaction

from backend.decorators import user_required
from user.models import User
from notifications.models import Notifications
from utils.customPagination import myPaginationNotifications

class NotificationsView(APIView,myPaginationNotifications):
    
    @user_required
    def get(self,request):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({"message": "User not found"})
            notifications = Notifications.objects.filter(user_receiver__id=user.id)
            objects = Notifications.to_list(notifications)
            new_notifications_number = Notifications.objects.filter(read=False).count()
            page = self.paginate_queryset(objects, request)
            response = self.get_paginated_response(page,new_notifications_number)
            return response

    @user_required
    def put(self,request):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({"message": "User not found"})
            Notifications.objects.filter(user_receiver=user).update(read=True)