from rest_framework import serializers

from recipe.models import Recipe
from .models import  RecipeImage

class ImageSerializer(serializers.Serializer):
    image = serializers.ImageField()
    type = serializers.CharField()


class RecipeImageSerializer(serializers.Serializer):
    images = serializers.ListField(child=ImageSerializer())
    recipe = serializers.PrimaryKeyRelatedField(
        many=False, queryset=Recipe.objects.all()
    )

    def create(self):
        created = []
        for image in self.validated_data.get("images"):
            object = {
                "image": image['image'],
                "type": image['type'],
                "recipe": self.validated_data.get("recipe"),
            }
            created.append(RecipeImage.objects.create(**object))
        return created

class DeleteRecipeImagesSerializer(serializers.Serializer):
    images = serializers.ListField(child=serializers.IntegerField())