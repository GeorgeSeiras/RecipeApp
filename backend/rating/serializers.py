from rest_framework import serializers

from recipe.models import Recipe
from .enum import rating_choices


class RateRecipeSerializer(serializers.Serializer):
    rating = serializers.ChoiceField(choices=rating_choices)


class RecipesRatingAverageSerializer(serializers.Serializer):
    recipes = serializers.ListField(child=serializers.PrimaryKeyRelatedField(
        many=False, queryset=Recipe.objects.all()))
