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
    def patch(self, request, recipe_id):
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
                raise NotFound({'message': 'Rating does not exist'})
            setattr(rating, 'rating', serializer.data['rating'])
            rating.save()
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


class RecipeRatingAverage(APIView):

    def get(self, request, recipe_id):
        with transaction.atomic():
            try:
                recipe = Recipe.objects.get(pk=recipe_id)
            except Recipe.DoesNotExist():
                raise NotFound({'message': 'Recipe does not exist'})
            rating_avg = Rating.objects.filter(
                recipe=recipe_id).aggregate(Avg('rating'))
            return JsonResponse({'status': 'ok', 'data': {'rating_avg': rating_avg}})


class RecipesRatingAverage(APIView):

    def get(self, request):
        with transaction.atomic():
            serializer = RecipesRatingAverageSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            recipes_averages = {}
            for recipe in serializer.validated_data['recipes']:
                print(recipe)
                rating_avg = Rating.objects.filter(
                    recipe=recipe.id).aggregate(Avg('rating'))
                recipes_averages[recipe.id] = rating_avg['rating__avg']
            return JsonResponse({"results": recipes_averages})
