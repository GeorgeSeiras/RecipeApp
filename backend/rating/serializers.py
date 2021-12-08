from rest_framework import serializers

from .enum import rating_choices

class RateRecipeSerializer(serializers.Serializer):
    rating = serializers.ChoiceField(choices=rating_choices)