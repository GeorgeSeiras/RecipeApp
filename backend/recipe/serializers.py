from rest_framework import serializers

from user.models import User
from .models import Recipe, Ingredient
from image.serializers import RecipeImageSerializer


class IngredientSerializer(serializers.ModelSerializer):
    amount = serializers.FloatField()
    unit = serializers.CharField(required=False)
    ingredient = serializers.CharField()
    recipe = serializers.RelatedField(source="recipe.recipe", read_only=True)

    class Meta:
        model = Ingredient
        fields = "__all__"

    def create( validated_data, recipe):
        return Ingredient.objects.create(**validated_data, recipe=recipe)


class RecipeCreateSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(
        required=False, allow_empty_file=True, max_length=None
    )
    title = serializers.CharField()
    prep_time = serializers.IntegerField()
    cook_time = serializers.IntegerField()
    desc = serializers.CharField(required=False, allow_null=True)
    servings = serializers.IntegerField()
    cuisine = serializers.ListField(child=serializers.CharField())
    course = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = Recipe
        fields = "__all__"


class RecipeSerializer(serializers.Serializer):
    user = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())
    title = serializers.CharField()
    prep_time = serializers.IntegerField()
    cook_time = serializers.IntegerField()
    desc = serializers.CharField(required=False)
    ingredients = IngredientSerializer(many=True)
    servings = serializers.IntegerField()
    cuisine = serializers.ListField(child=serializers.CharField())
    course = serializers.ListField(child=serializers.CharField())
    steps = serializers.ListField(child=serializers.CharField())

    def create(self):
        ingredient_data = self.validated_data.pop("ingredients")
        recipe = Recipe.objects.create( **self.validated_data)
        ingredients = []
        for ingredient in ingredient_data:
            created_ingredient = IngredientSerializer.create(ingredient, recipe)
            ingredients.append(created_ingredient)
        res = Recipe.objects.get(pk=recipe.id)
        return res.to_dict()


class RecipePatchSerializer(serializers.Serializer):
    title = serializers.CharField(required=False)
    prep_time = serializers.IntegerField(required=False)
    cook_time = serializers.IntegerField(required=False)
    desc = serializers.CharField(required=False)
    ingredients = IngredientSerializer(required=False, many=True)
    servings = serializers.IntegerField(required=False)
    cuisine = serializers.ListField(required=False, child=serializers.CharField())
    course = serializers.ListField(required=False, child=serializers.CharField())
    steps = serializers.ListField(required=False, child=serializers.CharField())


class IngredientCreateSerializer(serializers.Serializer):
    amount = serializers.FloatField()
    unit = serializers.CharField(required=False)
    ingredient = serializers.CharField()


class IngredientPatchSerializer(serializers.Serializer):
    amount = serializers.FloatField(required=False)
    unit = serializers.CharField(required=False)
    ingredient = serializers.CharField(required=False)


class StepCreateSerializer(serializers.Serializer):
    step = serializers.CharField()
    pos = serializers.IntegerField(required=False)
