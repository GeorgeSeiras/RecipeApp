from rest_framework import serializers

from ingredient.models import Ingredient

class IngredientSerializer(serializers.ModelSerializer):
    amount = serializers.FloatField()
    unit = serializers.CharField(required=False)
    ingredient = serializers.CharField()
    recipe = serializers.RelatedField(source='recipe.recipe', read_only=True)

    class Meta:
        model = Ingredient
        fields = '__all__'

    def create(self, validated_data, recipe):
        return Ingredient.objects.create(**validated_data, recipe=recipe)

class IngredientCreateSerializer(serializers.Serializer):
    amount = serializers.FloatField()
    unit = serializers.CharField(required=False)
    ingredient = serializers.CharField()
    recipe_id = serializers.IntegerField()