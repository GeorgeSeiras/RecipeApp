from rest_framework import serializers

from recipe.models import Recipe
from user.models import User
from .models import Comment

class CommentSerializer(serializers.Serializer):
    class Meta:
        model=Recipe
        fields='__all__'
        
class CreateCommentSerializer(serializers.Serializer):
    text = serializers.CharField()
    parent = serializers.PrimaryKeyRelatedField(
        queryset=Comment.objects.all(), required=False)
    recipe = serializers.PrimaryKeyRelatedField(queryset=Recipe.objects.all())


class PatchCommentSerializer(serializers.Serializer):
    text = serializers.CharField(required=False)
    deleted = serializers.BooleanField(required=False)
