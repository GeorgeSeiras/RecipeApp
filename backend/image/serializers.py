import json
from django.db import models
from django.db.models.query import QuerySet
from rest_framework import serializers, status

from recipe.models import Recipe

from .models import RecipeImageType,RecipeImage
from utils.custom_exceptions import CustomException

class RecipeImageSerializer(serializers.Serializer):
    images = serializers.ListField(child=serializers.ImageField())
    imagesData = serializers.JSONField()
    recipe = serializers.PrimaryKeyRelatedField(many=False,queryset=Recipe.objects.all())

    def create(self):
        created = []
        imageTypes = []
        types = []
        for key,value in RecipeImageType.choices:
            imageTypes.append(key)
        data = json.loads(self.validated_data.get('imagesData')[0])
        if(len(data) != len(self.validated_data.get('images'))):
            raise CustomException(
                    'Number of images must match that of image types', status.HTTP_400_BAD_REQUEST)
        for type in data:
            if type['type'] not in imageTypes:
                raise CustomException(
                    'Invalid image type '+type['type'], status.HTTP_400_BAD_REQUEST)
            types.append(type['type'])
        i=0
        print(self.validated_data['recipe'])
        for image in self.validated_data.get('images'):
            object={
                'image':image,
                'type':types[i],
                'recipe':self.validated_data.get('recipe')
            }
            created.append(RecipeImage.objects.create(**object))
            i+=1
        return created