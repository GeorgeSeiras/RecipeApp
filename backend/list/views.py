from django.http.response import JsonResponse
from rest_framework import serializers
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.views import APIView
from django.db import transaction

from backend.decorators import user_required
from list.serializers import ListCreateSerializer, ListPatchSerializer
from list.models import List
from user.models import User


class ListCreate(APIView):

    @user_required
    def post(self, request):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({'message': 'User does not exist'})
            serializer = ListCreateSerializer(data=request.data)
            not serializer.is_valid(raise_exception=True)
            list = List.objects.create(user=user, **serializer.data)
            return JsonResponse({
                'status': 'ok',
                'data': list.to_dict()
            })


class ListDetail(APIView):

    def get(self, request, list_id):
        try:
            list = List.objects.get(pk=list_id)
        except List.DoesNotExist:
            raise NotFound({'message': 'List does not exist'})
        return JsonResponse({'status':'ok','data':list.to_dict()})
        
    @user_required
    def patch(self, request, list_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({'message': 'User does not exist'})
            try:
                list = List.objects.get(pk=list_id)
            except List.DoesNotExist:
                raise NotFound({'message': 'List does not exist'})
            if(user != list.user):
                raise PermissionDenied(
                    {"message':'You cannot edit another user's lists"})
            serializer = ListPatchSerializer(data=request.data)
            not serializer.is_valid(raise_exception=True)
            for key, value in serializer.data.items():
                setattr(list, key, value)
            list.save()
            return JsonResponse({'status': 'ok', 'data': list.to_dict()})
