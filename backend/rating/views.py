from django.http.response import JsonResponse
from backend.decorators import user_required
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound, PermissionDenied
from django.db import transaction
from rest_framework import status

from utils.custom_exceptions import CustomException
from .serializers import RateRecipeSerializer
from .models import Rating
from user.models import User
from recipe.models import Recipe


class RateRecipe(APIView):

    @user_required
    def post(self, request, recipe_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({'message': 'User not found'})
            try:
                recipe = Recipe.objects.get(pk=recipe_id)
            except Recipe.DoesNotExist:
                raise NotFound({'message': 'Recipe does not exist'})
            serializer = RateRecipeSerializer(data=request.data)
            not serializer.is_valid(raise_exception=True)
            rating_exists_check = Rating.objects.filter(
                recipe=recipe, user=user)
            if rating_exists_check:
                raise CustomException(
                    'You have already rated this recipe', status.HTTP_400_BAD_REQUEST)
            rating = Rating.objects.create(
                recipe=recipe, user=user, rating=serializer.data['rating'])
            return JsonResponse({'status': 'ok', 'data': rating.to_dict()})

    @user_required
    def delete(self, request, recipe_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({'message': 'User not found'})
            try:
                recipe = Recipe.objects.get(pk=recipe_id)
            except Recipe.DoesNotExist:
                raise NotFound({'message': 'Recipe does not exist'})
            try:
                rating = Rating.objects.get(user=request.user)
            except Rating.DoesNotExist:
                raise NotFound({'message': 'Rating does not exist'})
            if(rating.user != request.user):
                raise PermissionDenied(
                    {"You cannot delete another user's ratings"})
            rating.delete()
            return JsonResponse({'status': 'ok'}, status=status.HTTP_200_OK)
