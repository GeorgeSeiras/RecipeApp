from django.db.models.aggregates import Aggregate
from django.http.response import JsonResponse
from backend.decorators import user_required
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound, PermissionDenied
from django.db import transaction
from django.db.models import Avg
from rest_framework import status

from utils.custom_exceptions import CustomException
from .serializers import RateRecipeSerializer, RecipesRatingAverageSerializer
from .models import Rating
from user.models import User
from recipe.models import Recipe


class RateRecipe(APIView):

    @user_required
    def get(self, request, recipe_id):
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
                rating = Rating.objects.get(user=user, recipe=recipe)
            except Rating.DoesNotExist:
                return JsonResponse({'result': None})
            return JsonResponse({'result': rating.to_dict()})

    @user_required
    def put(self, request, recipe_id):
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
            try:
                rating = Rating.objects.get(user=request.user, recipe=recipe)
            except Rating.DoesNotExist:
                rating = Rating.objects.create(
                    recipe=recipe, user=user, rating=serializer.validated_data['rating'])
                return JsonResponse({'result': rating.to_dict()})
            setattr(rating, 'rating', serializer.data['rating'])
            rating.save()
            return JsonResponse({'result': rating.to_dict()})

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


class RecipeRatingAverage(APIView):

    def get(self, request, recipe_id):
        with transaction.atomic():
            try:
                recipe = Recipe.objects.get(pk=recipe_id)
            except Recipe.DoesNotExist:
                raise NotFound({'message': 'Recipe not found'})
            rating_avg = Rating.objects.filter(
                recipe=recipe_id).aggregate(Avg('rating'))
            return JsonResponse({'result':  rating_avg})
