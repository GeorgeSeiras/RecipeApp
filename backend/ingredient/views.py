from django.db import transaction
from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from user.models import User
from ingredient.serializers import IngredientCreateSerializer, IngredientSerializer
from recipe.models import Recipe
from backend.decorators import user_required


class IngredientCreate(APIView):

    @user_required
    def post(self, request):
        with transaction.atomic():
            user = User.objects.get(username=request.user)
            serializer = IngredientCreateSerializer(data=request.data)
            if(not serializer.is_valid()):
                raise PermissionDenied
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
