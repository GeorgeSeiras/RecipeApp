from rest_framework import serializers

from user.models import User
from .models import Ingredient, Recipe, Step

class IngredientSerializer(serializers.ModelSerializer):
    recipe_id = serializers.RelatedField(source='recipe',read_only=True)
    amount = serializers.FloatField()
    unit = serializers.CharField()
    ingredient = serializers.CharField()

    class Meta:
        model = Ingredient
        fields = '__all__'

    def create(self, validated_data,recipe):
        return Ingredient.objects.create(recipe_id=recipe,**validated_data)

class StepSerializer(serializers.ModelSerializer):
    recipe_id = serializers.RelatedField(source='recipe',read_only=True)
    step_num = serializers.IntegerField()
    desc = serializers.CharField()

    class Meta:
        model = Step
        fields = '__all__'

    def create(self, validated_data,recipe):
        return Step.objects.create(**validated_data,recipe_id=recipe)
        
class RecipeCreateSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=False,allow_empty_file=True,max_length=None)
    title = serializers.CharField()
    prep_time = serializers.IntegerField()
    cook_time = serializers.IntegerField()
    desc = serializers.CharField(required=False,allow_null=True)
    servings = serializers.IntegerField()
    cuisine = serializers.ListField(child=serializers.CharField())
    course = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = Recipe
        fields = '__all__'

         

class RecipeSerializer(serializers.Serializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    photo = serializers.ImageField(required=False,allow_empty_file=True,max_length=None)
    title = serializers.CharField()
    prep_time = serializers.IntegerField()
    cook_time = serializers.IntegerField()
    desc = serializers.CharField(required=False,allow_null=True)
    ingredients = IngredientSerializer(many=True)
    servings = serializers.IntegerField()
    cuisine = serializers.ListField(child=serializers.CharField())
    course = serializers.ListField(child=serializers.CharField())
    steps = StepSerializer(many=True)

    def create(self,validated_data):
        ingredient_data = validated_data.pop('ingredients')
        step_data = validated_data.pop('steps')
        recipe = Recipe.objects.create(**validated_data)
        ingredients =[]
        steps=[]
        for ingredient in ingredient_data:
            ingredients.append(IngredientSerializer.create(self,ingredient,recipe))
        for step in step_data:
            steps.append(StepSerializer.create(self,step,recipe))
        return recipe,ingredients,steps 
        

    