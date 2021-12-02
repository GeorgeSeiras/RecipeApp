from rest_framework import serializers

from user.models import User
from .models import Recipe
from ingredient.models import Ingredient


class IngredientSerializer(serializers.ModelSerializer):
    amount = serializers.FloatField()
    unit = serializers.CharField(required=False)
    ingredient = serializers.CharField()

    class Meta:
        model = Ingredient
        fields = '__all__'

    def create(self, validated_data):
        return Ingredient.objects.create(**validated_data)


class RecipeCreateSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(
        required=False, allow_empty_file=True, max_length=None)
    title = serializers.CharField()
    prep_time = serializers.IntegerField()
    cook_time = serializers.IntegerField()
    desc = serializers.CharField(required=False, allow_null=True)
    servings = serializers.IntegerField()
    cuisine = serializers.ListField(child=serializers.CharField())
    course = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = Recipe
        fields = '__all__'


class RecipeSerializer(serializers.Serializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    photo = serializers.ImageField(
        required=False, allow_empty_file=True, max_length=None)
    title = serializers.CharField()
    prep_time = serializers.IntegerField()
    cook_time = serializers.IntegerField()
    desc = serializers.CharField(required=False, allow_null=True)
    ingredients = IngredientSerializer(many=True)
    servings = serializers.IntegerField()
    cuisine = serializers.ListField(child=serializers.CharField())
    course = serializers.ListField(child=serializers.CharField())
    steps = serializers.ListField(child=serializers.CharField())

    def create(self, validated_data):
        ingredient_data = validated_data.pop('ingredients')
        ingredients = []
        for ingredient in ingredient_data:
            created_ingredient = IngredientSerializer.create(self, ingredient)
            ingredients.append(created_ingredient.id)
        recipe = Recipe.objects.create(**validated_data)
        recipe.ingredients.set(ingredients)
        return recipe, ingredient_data
