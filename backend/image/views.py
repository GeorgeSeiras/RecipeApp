from django.db import transaction
from django.http.response import JsonResponse
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.views import APIView
from rest_framework import status
import environ
import os

from utils.custom_exceptions import CustomException, CustomExceptionUpload
from backend.decorators import user_required
from user.models import User
from recipe.models import Recipe
from .serializers import DeleteRecipeImagesSerializer, RecipeImageSerializer
from .models import RecipeImage, get_file_path

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings

env = environ.Env()
environ.Env.read_env()


class ImageUpload(APIView):
    def post(self, request):
        if('upload' not in request.data):
            raise CustomExceptionUpload('No file found', 400)
        file = request.data['upload']
        filename = get_file_path(None, str(file))
        path = default_storage.save(filename, ContentFile(file.read()))
        response = {

            "url": 'http://'+env('URL')+'/media/'+path,

        }
        return JsonResponse(response)

    def delete(self, request):
        filepath = request.data['url']
        split_text = filepath.split('/')
        if(not os.path.exists(os.path.join(settings.MEDIA_ROOT,
                                           split_text[len(split_text)-1]))):
            raise CustomException('File not found', 404)
        os.remove(os.path.join(settings.MEDIA_ROOT,
                  split_text[len(split_text)-1]))
        return JsonResponse({'result': 'ok'})


class RecipeImageView(APIView):
    def get(self, request, recipe_id):
        with transaction.atomic():
            try:
                recipe = Recipe.objects.get(pk=recipe_id)
            except User.DoesNotExist:
                raise NotFound({"message": "Recipe not found"})
            images = RecipeImage.objects.filter(recipe=recipe)
            return JsonResponse({"result": RecipeImage.recipe_images_to_list(images)})

    @user_required
    def put(self, request, recipe_id):

        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({"message": "User not found"})
            try:
                recipe = Recipe.objects.get(pk=recipe_id)
            except Recipe.DoesNotExist:
                raise NotFound({"message": "Recipe not found"})
            if user.id != recipe.user.id:
                raise PermissionDenied(
                    {"You cannot modify another user's recipe"})
            images_list = []
            for i in range(0, len(request.data)//2):
                if not ('images['+str(i)+'].image' in request.data
                        and 'images['+str(i)+'].type' in request.data):
                    raise CustomException(
                        'Image or type is missing', status.HTTP_400_BAD_REQUEST
                    )
                image_dict = {}
                image_dict['image'] = request.data['images['+str(i)+'].image']
                image_dict['type'] = request.data['images['+str(i)+'].type']
                images_list.append(image_dict)
            serializer = RecipeImageSerializer(
                data={'images': images_list, "recipe": recipe.id}
            )
            serializer.is_valid(raise_exception=True)
            images = serializer.create()
            return JsonResponse({"result": RecipeImage.recipe_images_to_list(images)})


class RecipeImageDetail(APIView):
    @user_required
    def delete(self, request, image_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({"message": "User not found"})
            try:
                image = RecipeImage.objects.get(pk=image_id)
            except RecipeImage.DoesNotExist:
                raise NotFound({"message": "Image not found"})
            if user.id != image.recipe.user.id:
                raise PermissionDenied(
                    {"You cannot modify another user's recipe"})
            image.delete()
            return JsonResponse({"result": "ok"})


class RecipeImagesView(APIView):

    @user_required
    def delete(self, request, recipe_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({"message": "User not found"})
            try:
                recipe = Recipe.objects.get(pk=recipe_id)
            except Recipe.DoesNotExist:
                raise NotFound({"message": "Recipe not found"})
            if(user.id != recipe.user.id):
                raise PermissionDenied(
                    {"message':'Cannot edit another user's recipe"})
            serializer = DeleteRecipeImagesSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            RecipeImage.objects.filter(
                id__in=serializer.validated_data['images']).delete()
            return JsonResponse({"result": 'ok'})
