from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.db import transaction
from django.forms.models import model_to_dict
import json

from recipe.models import Recipe
from user.models import User
from recipe.serializers import RecipeSerializer
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
            recipe, ingredients = serializer.save()
            recipe_dict = model_to_dict(recipe)
            # empty imageField is not json serializable
            if(recipe_dict['photo'] == ""):
                recipe_dict.pop('photo', None)
            # we need to json serialize the image url not the image itself
            elif 'photo' in recipe_dict.keys():
                recipe_dict['photo'] = json.dumps(str(recipe_dict['photo']))
            recipe_dict['ingredients'] = ingredients
            return Response({
                'status': 'ok',
                'data': {
                    'recipe': recipe_dict
                }
            }, status=status.HTTP_201_CREATED)


class RecipeDetail(APIView):

    def get(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk)
            return Response({
                'status': 'ok',
                'data': Recipe.recipe_to_dict(recipe)})
        except User.DoesNotExist:
            Response(status=status.HTTP_404_NOT_FOUND)

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
        return Response({'status':'ok'},status=status.HTTP_200_OK)