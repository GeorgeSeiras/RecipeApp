from re import S
from django.db import transaction
from django.http.response import JsonResponse
from django.db.models import Q
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.views import APIView

from utils.custom_exceptions import CustomException
from backend.decorators import user_required
from media_library.models import Folder, FolderImage
from user.models import User
from .serializers import FolderCreateSerializer, FolderMediaSerializer, FolderUpdateSerializer, FolderQuerySerializer, ImageCreateSerializer
from utils.customPagination import myPagination


class FolderView(APIView, myPagination):

    @user_required
    def get(self, request):
        with transaction.atomic():
            serializer = FolderQuerySerializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound('User not found')
            query = Q()
            query &= Q(user__username__iexact=user.username)
            if 'parent' in serializer.validated_data:
                query &= Q(parent=serializer.validated_data['parent'])
            else:
                query &= Q(depth=0)
            folders = Folder.objects.filter(query)
            objects = Folder.to_list(folders)
            page = self.paginate_queryset(objects, request)
            response = self.get_paginated_response(page)
            return response

    @user_required
    def post(self, request):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound('User not found')
            serializer = FolderCreateSerializer(
                data={**request.data, 'user': user.id})
            serializer.is_valid(raise_exception=True)
            created = serializer.create()
            return JsonResponse({'result': created.to_dict()})


class FolderDetail(APIView):

    @user_required
    def patch(self, request, folder_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound('User not found')
            try:
                folder = Folder.objects.get(pk=folder_id)
            except Folder.DoesNotExist:
                raise NotFound('Folder not found')
            if(user.pk != folder.user.pk):
                raise CustomException(
                    "Cannot modify another user's folder", 400)
            serializer = FolderUpdateSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            folder.name = serializer.validated_data['name']
            folder.save()
            return JsonResponse({'result': folder.to_dict()})

    @user_required
    def delete(self, request, folder_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound('User not found')
            try:
                folder = Folder.objects.get(pk=folder_id)
            except Folder.DoesNotExist:
                raise NotFound('Folder not found')
            if(user.pk != folder.user.pk):
                raise CustomException(
                    "Cannot modify another user's folder", 400)
            folder.delete()
            return JsonResponse({'result': folder.to_dict()})


class MediaCreate(APIView):

    @user_required
    def post(self, request):
        try:
            user = User.objects.get(username=request.user)
        except User.DoesNotExist:
            raise NotFound({"message": "User not found"})
        serializer = ImageCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        print(serializer.validated_data)
        if serializer.validated_data['folder'].user.id != user.id:
            raise PermissionDenied(
                {'message': "Cannot edit another user's folders"})
        image = FolderImage.objects.create(**serializer.validated_data)
        return JsonResponse({'result': image.to_dict()})


class MediaDetail(APIView):

    @user_required
    def delete(self, request, media_id):
        try:
            user = User.objects.get(username=request.user)
        except User.DoesNotExist:
            raise NotFound({"message": "User not found"})
        try:
            image = FolderImage.objects.get(pk=media_id)
        except FolderImage.DoesNotExist:
            raise NotFound({'message': 'Image not found'})
        if image.folder.user.id != user.id:
            raise PermissionDenied(
                {'message': "Cannot edit another user's images"})
        image.delete()
        return JsonResponse({'result': image.to_dict()})


class FolderMedia(APIView):

    @user_required
    def get(self, request):
        try:
            user = User.objects.get(username=request.user)
        except User.DoesNotExist:
            raise NotFound({"message": "User not found"})
        serializer = FolderMediaSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        if user.id != serializer.validated_data['folder'].user.id:
            raise PermissionDenied({'message': 'This belongs to another user'})
        # images = FolderImage.objects.filter(folder=serializer.validated_data['folder'])
        # objects = Folder.to_list(images)
        # page = self.paginate_queryset(objects, request)
        # response = self.get_paginated_response(page)
        # return response
        limit = serializer.validated_data['limit']
        offset = serializer.validated_data['offset']
        images = FolderImage.objects.filter(
            folder=serializer.validated_data['folder'])[offset:offset+limit]
        return JsonResponse({
            'results': FolderImage.to_list(images),
            'count': len(images)

        })
