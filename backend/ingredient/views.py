from django.db import transaction
from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status

from ingredient.serializers import IngredientCreateSerializer, IngredientSerializer
from recipe.models import Recipe
from backend.decorators import user_required


class IngredientDetail(APIView):

    @user_required
    def post(self, request):
        with transaction.atomic():
            serializer = IngredientCreateSerializer(data=request.data)
            if(not serializer.is_valid()):
                return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            recipe = Recipe.objects.get(pk=request.data.pop('recipe_id'))
            if(recipe.user.username != str(request.user)):
                return JsonResponse("Cannot alter another user's recipe", status=status.HTTP_401_UNAUTHORIZED)
            
            res = IngredientSerializer.create(self,
                                        serializer.validated_data, recipe)
            return JsonResponse({
                'status': 'ok',
                'data': res.to_dict()
            },
                status=status.HTTP_200_OK)
