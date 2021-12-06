from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers, status
from django.db import transaction
from django.forms.models import model_to_dict
import json

from ingredient.models import Ingredient
from recipe.models import Recipe
from user.models import User
from recipe.serializers import IngredientSerializer, RecipeSerializer, RecipePatchSerializer
from backend.decorators import user_required


class RecipeCreate(APIView):

    @user_required
    def post(self, request):
        data = request.data
        user = User.objects.get(username=request.user)
        data['user'] = user.id
        serializer = RecipeSerializer(data=data)
        with transaction.atomic():
            if (not serializer.is_valid()):
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            recipe = serializer.save()
            return Response({
                'status': 'ok',
                'data': {
                    'recipe': recipe
                }
            }, status=status.HTTP_201_CREATED)


class RecipeDetail(APIView):

    def get(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk)
            return Response({
                'status': 'ok',
                'data': recipe.to_dict()})
        except Recipe.DoesNotExist:
            return Response('Recipe does not exist', status=status.HTTP_404_NOT_FOUND)

    @user_required
    def patch(self, request, pk):
        with transaction.atomic():
            try:
                recipe = Recipe.objects.get(pk=pk)
                if(recipe.user.username != str(request.user)):
                    return Response("Cannot alter another user's recipe",
                                    status=status.HTTP_401_UNAUTHORIZED)
                serializer = RecipePatchSerializer(data=request.data)
                if(not serializer.is_valid()):
                    return Response(serializer.errors,
                                    status=status.HTTP_400_BAD_REQUEST)
                if(serializer.data.get('title', None)):
                    recipe.title = serializer.data['title']
                for key, value in serializer.data.items():
                    # replaces existing ingredients
                    if(key == 'ingredients'):
                        ingredients = []
                        Ingredient.objects.filter(recipe=recipe.id).delete()
                        for ingredient in value:
                            ingredient = IngredientSerializer.create(
                                self, ingredient, recipe)
                            ingredients.append(ingredient)
                        setattr(recipe,key,ingredients)
                    else:
                        setattr(recipe,key,value)
                recipe.save()
                res = Recipe.objects.filter(pk=recipe.id)
                return Response({'status': 'ok', 'data': Recipe.recipes_to_list(res)})
            except Recipe.DoesNotExist:
                return Response('Recipe does not exist',
                                status=status.HTTP_404_NOT_FOUND)

    @user_required
    def delete(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk)
        except User.DoesNotExist:
            Response(status=status.HTTP_404_NOT_FOUND)
        try:
            user = User.objects.get(username=request.user)
        except Recipe.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if str(recipe.user) != user.username:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        Recipe.objects.filter(id=pk).delete()
        return Response({'status': 'ok'}, status=status.HTTP_200_OK)
