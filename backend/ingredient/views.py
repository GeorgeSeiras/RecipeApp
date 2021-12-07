from django.core.exceptions import BadRequest
from django.db import transaction
from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied

from ingredient.models import Ingredient
from user.models import User
from ingredient.serializers import IngredientCreateSerializer, IngredientPatchSerializer, IngredientSerializer
from recipe.models import Recipe
from backend.decorators import user_required


class IngredientCreate(APIView):

    @user_required
    def post(self, request):
        with transaction.atomic():
            user = User.objects.get(username=request.user)
            serializer = IngredientCreateSerializer(data=request.data)
            if(not serializer.is_valid()):
                raise BadRequest({"message": serializer.errors})
            recipe = Recipe.objects.get(pk=request.data.pop('recipe_id'))
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
    def patch(self, request, pk):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({"message": "User not found"})
            try:
                ingredient = Ingredient.objects.get(pk=pk)
            except Ingredient.DoesNotExist:
                raise NotFound({"message": "Ingredient not found"})
            if(ingredient.recipe.user.id != user.id):
                raise PermissionDenied(
                    {"message": "You cannot modify another user's ingredient"})
            serializer = IngredientPatchSerializer(data=request.data)
            if(not serializer.is_valid()):
                raise BadRequest({"message": serializer.errors})
            for key, value in serializer.data.items():
                setattr(ingredient,key,value)
            ingredient.save()
            return JsonResponse({
                'status': 'ok',
                'data': ingredient.to_dict()},
                status=status.HTTP_200_OK)
    
    @user_required
    def delete(self, request, pk):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({"message": "User not found"})
            try:
                ingredient = Ingredient.objects.get(pk=pk)
            except Ingredient.DoesNotExist:
                raise NotFound({"message": "Ingredient not found"})
            if(ingredient.recipe.user.id != user.id):
                raise PermissionDenied(
                    {"message": "You cannot delete another user's ingredient"})
            ingredient.delete()
            return JsonResponse({'status': 'ok'}, status=status.HTTP_200_OK)