from rest_framework import serializers
from recipe.models import Recipe

from list.models import List


class ListSerializer(serializers.ModelSerializer):
    model = serializers.SerializerMethodField('model_name')

    def model_name(self, object):
        return 'list'

    class Meta:
        model = List
        fields = ['id','user,name,desc,removed,model']


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
