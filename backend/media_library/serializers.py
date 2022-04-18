from rest_framework import serializers

from user.models import User
from .models import Folder


class FolderCreateSerializer(serializers.Serializer):
    parent = serializers.PrimaryKeyRelatedField(many=False, queryset=Folder.objects.all(),required=False)
    user = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())
    name = serializers.CharField(max_length=50)

    def create(self):
        if 'parent' not in self.validated_data:
            return Folder.objects.create(**{**self.validated_data, 'depth':0})
        else:
            depth =self.validated_data['parent'].depth +1
            return Folder.objects.create(**{**self.validated_data, 'depth':depth})


class FolderUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50)


class FolderQuerySerializer(serializers.Serializer):
        parent = serializers.PrimaryKeyRelatedField(many=False, queryset=Folder.objects.all(),required=False)

class ImageCreateSerializer(serializers.Serializer):
    image = serializers.ImageField()
    folder = serializers.PrimaryKeyRelatedField(many=False, queryset=Folder.objects.all())

class FolderMediaSerializer(serializers.Serializer):
    folder = serializers.PrimaryKeyRelatedField(many=False, queryset=Folder.objects.all())
    offset = serializers.IntegerField(default=0)
    limit = serializers.IntegerField(default=16)