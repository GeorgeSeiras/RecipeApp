from re import UNICODE
from django.db.utils import DatabaseError
from django.shortcuts import render
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.db import transaction
from django.core import serializers as core_serializers
from django.forms.models import model_to_dict
import json

from recipe.serializers import IngredientSerializer, RecipeSerializer, RecipeSerializer, StepSerializer

class RecipeCreate(APIView):

    def post(self,request):
        serializer = RecipeSerializer(data = request.data)
        with transaction.atomic():
            if (not serializer.is_valid()):
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            recipe,ingredients,steps = serializer.save()
            recipe_dict = model_to_dict(recipe)
            #empty imageField is not json serializable
            if(recipe_dict['photo'] == ""):
                recipe_dict.pop('photo',None)
            #we need to json serialize the image url not the image itself
            elif 'photo' in recipe_dict.keys():
                recipe_dict['photo']=json.dumps(str(recipe_dict['photo']))
            ingredient_dict = []
            step_dict = []
            for ingredient in ingredients:
                ingredient_dict.append(model_to_dict(ingredient))
            for step in steps:
                step_dict.append(model_to_dict(step))
            recipe_dict['ingredients']=ingredient_dict
            recipe_dict['steps']=step_dict
            return Response({'status':'ok','data':{
               'recipe':recipe_dict
            }
            },status=status.HTTP_201_CREATED)