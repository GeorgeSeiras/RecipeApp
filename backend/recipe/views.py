from django.core.exceptions import BadRequest, PermissionDenied
from django.http.response import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.exceptions import NotFound
from django.db import transaction

from recipe.models import Recipe, Ingredient
from user.models import User
from recipe.serializers import IngredientCreateSerializer, IngredientPatchSerializer, IngredientSerializer, RecipeSerializer, RecipePatchSerializer, StepCreateSerializer
from backend.decorators import admin_required, user_required


class RecipeCreate(APIView):

    @user_required
    def post(self, request):
        data = request.data
        user = User.objects.get(username=request.user)
        data['user'] = user.id
        serializer = RecipeSerializer(data=data)
        with transaction.atomic():
            serializer.is_valid(raise_exception=True)
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
            raise NotFound({"message": "Recipe not found"})

    @user_required
    def patch(self, request, pk):
        with transaction.atomic():
            try:
                recipe = Recipe.objects.get(pk=pk)
            except Recipe.DoesNotExist:
                raise NotFound("Recipe not found")
            if(recipe.user.username != str(request.user)):
                raise PermissionDenied(
                    {"You cannot modify another user's recipe"})

            serializer = RecipePatchSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
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
            raise NotFound({"message": "User not found"})
        try:
            user = User.objects.get(username=request.user)
        except Recipe.DoesNotExist:
            raise NotFound({"message": "recipe not found"})
        if str(recipe.user) != user.username:
            raise PermissionDenied(
                {"message": "You cannot delete another user's recipe"})
        Recipe.objects.filter(id=pk).delete()
        return JsonResponse({'status': 'ok'}, status=status.HTTP_200_OK)


class RecipeIngredients(APIView):

    def get(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            raise NotFound({"message": "Recipe not found"})
        return JsonResponse({
            'status': 'ok',
            'data': recipe.to_dict()['ingredients']
        })


class IngredientCreate(APIView):

    @user_required
    def post(self, request, recipe_id):
        with transaction.atomic():
            user = User.objects.get(username=request.user)
            serializer = IngredientCreateSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            recipe = Recipe.objects.get(pk=recipe_id)
            if(recipe.user.id != user.id):
                raise PermissionDenied
            res = IngredientSerializer.create(self,
                                              serializer.validated_data, recipe)
            return JsonResponse({
                'status': 'ok',
                'data': res.to_dict()
            },
                status=status.HTTP_200_OK)


class IngredientDetail(APIView):

    @user_required
    def patch(self, request, recipe_id, ingr_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({"message": "User not found"})
            try:
                recipe = Recipe.objects.get(pk=recipe_id)
            except Recipe.DoesNotExist:
                raise NotFound('Recipe does not exist')
            try:
                ingredient = Ingredient.objects.get(pk=ingr_id)
            except Ingredient.DoesNotExist:
                raise NotFound({"message": "Ingredient not found"})
            if(recipe.user.id != user.id):
                raise PermissionDenied(
                    {"message": "You cannot modify another user's recipe"})
            serializer = IngredientPatchSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            for key, value in serializer.data.items():
                setattr(ingredient, key, value)
            ingredient.save()
            return JsonResponse({
                'status': 'ok',
                'data': ingredient.to_dict()},
                status=status.HTTP_200_OK)

    @user_required
    def delete(self, request, recipe_id, ingr_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({"message": "User not found"})
            try:
                recipe = Recipe.objects.get(pk=recipe_id)
            except Recipe.DoesNotExist:
                raise NotFound('Recipe does not exist')
            try:
                ingredient = Ingredient.objects.get(pk=ingr_id)
            except Ingredient.DoesNotExist:
                raise NotFound({"message": "Ingredient not found"})
            if(recipe.user.id != user.id):
                raise PermissionDenied(
                    {"message": "You cannot delete another user's ingredient"})
            ingredient.delete()
            return JsonResponse({'status': 'ok'}, status=status.HTTP_200_OK)


class StepCreateView(APIView):

    @user_required
    def post(self, request, recipe_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({"message": "User not found"})
            try:
                recipe = Recipe.objects.get(pk=recipe_id)
            except Recipe.DoesNotExist:
                raise NotFound('Recipe does not exist')
            if(recipe.user.id != user.id):
                raise PermissionDenied(
                    {"message": "You cannot mofidy another user's recipe"})
            serializer = StepCreateSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            pos = serializer.data.get('pos', None)
            if(pos != None):
                recipe.steps.insert(pos, serializer.data['step'])
            else:
                recipe.steps.append(serializer.data['step'])
            recipe.save()
            return JsonResponse({
                'status': 'ok',
                'data': recipe.to_dict()
            }, status=status.HTTP_200_OK)
