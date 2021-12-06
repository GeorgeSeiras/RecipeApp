from django.core.exceptions import PermissionDenied
from django.http.response import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.exceptions import NotFound
from django.db import transaction

from ingredient.models import Ingredient
from recipe.models import Recipe
from user.models import User
from recipe.serializers import IngredientSerializer, RecipeSerializer, RecipePatchSerializer
from backend.decorators import admin_required, user_required


class RecipeCreate(APIView):

    @user_required
    def post(self, request):
        data = request.data
        user = User.objects.get(username=request.user)
        data['user'] = user.id
        serializer = RecipeSerializer(data=data)
        with transaction.atomic():
            if (not serializer.is_valid()):
                return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            recipe = serializer.save()
            return JsonResponse({
                'status': 'ok',
                'data': {
                    'recipe': recipe
                }
            }, status=status.HTTP_201_CREATED)


class RecipeDetail(APIView):

    def get(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk)
            return JsonResponse({
                'status': 'ok',
                'data': recipe.to_dict()})
        except Recipe.DoesNotExist:
            raise NotFound({"message":"Recipe not found"})

    @user_required
    def patch(self, request, pk):
        with transaction.atomic():
            try:
                recipe = Recipe.objects.get(pk=pk)
            except Recipe.DoesNotExist:
                raise NotFound("Recipe not found")
            if(recipe.user.username != str(request.user)):
                raise PermissionDenied({"You cannot modify another user's recipe"})

            serializer = RecipePatchSerializer(data=request.data)
            if(not serializer.is_valid()):
                return JsonResponse(serializer.errors,
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
                    setattr(recipe, key, ingredients)
                else:
                    setattr(recipe, key, value)
            recipe.save()
            res = Recipe.objects.filter(pk=recipe.id)
            return JsonResponse({'status': 'ok', 'data': Recipe.recipes_to_list(res)})

    @user_required
    def delete(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk)
        except User.DoesNotExist:
            raise NotFound({"message":"User not found"})
        try:
            user = User.objects.get(username=request.user)
        except Recipe.DoesNotExist:
            raise NotFound({"message":"recipe not found"})
        if str(recipe.user) != user.username:
            raise PermissionDenied({"message":"You cannot delete another user's recipe"})
        Recipe.objects.filter(id=pk).delete()
        return JsonResponse({'status': 'ok'}, status=status.HTTP_200_OK)
