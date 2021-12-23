from rest_framework import serializers

from recipe.models import Recipe
from user.models import User
from .models import Comment


class CreateCommentSerializer(serializers.Serializer):
    text = serializers.CharField()
    parent = serializers.PrimaryKeyRelatedField(
        queryset=Comment.objects.all(), required=False)
