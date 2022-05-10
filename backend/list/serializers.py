from rest_framework import serializers

from user.models import User
from recipe.models import Recipe

from list.models import List


class ListSerializer(serializers.ModelSerializer):
    model = serializers.SerializerMethodField('model_name')
    user = serializers.SerializerMethodField('user_obj')


    def model_name(self, object):
        return 'list'

    def user_obj(self,object):
        return object.user.to_dict()
    
    class Meta:
        model = List
        fields = ['id', 'user', 'name', 'desc', 'removed', 'model']


class ListCreateSerializer(serializers.Serializer):
    name = serializers.CharField()
    desc = serializers.CharField(required=False)


class ListPatchSerializer(serializers.Serializer):
    name = serializers.CharField(required=False)
    desc = serializers.CharField(required=False)


class ListRecipeSerializer(serializers.Serializer):
    recipe = serializers.PrimaryKeyRelatedField(queryset=Recipe.objects.all())


class RecipeInListsSerializer(serializers.Serializer):
    lists = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=List.objects.all()))
    recipe = serializers.PrimaryKeyRelatedField(queryset=Recipe.objects.all())
