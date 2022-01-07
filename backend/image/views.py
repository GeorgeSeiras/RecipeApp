from django.db import transaction
from django.http.response import JsonResponse
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.views import APIView

from backend.decorators import user_required
from user.models import User
from recipe.models import Recipe
from .serializers import RecipeImageSerializer
from .models import RecipeImage

class RecipeImageView(APIView):

    def get(self, request,recipe_id):
        with transaction.atomic():
            try:
                recipe = Recipe.objects.get(pk=recipe_id)
            except User.DoesNotExist:
                raise NotFound({"message": "Recipe not found"})
            images = RecipeImage.objects.filter(recipe=recipe)
            return JsonResponse({'result': RecipeImage.recipe_images_to_list(images)})

    @user_required
    def post(self, request,recipe_id):
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
                    {"You cannot modify another user's recipe"}) 
            serializer = RecipeImageSerializer(data={**request.data,'recipe':recipe.id})
            serializer.is_valid(raise_exception=True)
            images = serializer.create()
            raise NotFound()
            return JsonResponse({'result':RecipeImage.recipe_images_to_list(images)})

class RecipeImageDetail(APIView):

    @user_required
    def delete(self,request,image_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({"message": "User not found"})
            try:
                image = RecipeImage.objects.get(pk=image_id)
            except RecipeImage.DoesNotExist:
                raise NotFound({"message": "Image not found"})
            if(user.id != image.recipe.user.id):
                raise PermissionDenied(
                    {"You cannot modify another user's recipe"}) 
            image.delete()
            return JsonResponse({'result':'ok'})