from rest_framework import serializers

from list.models import List


class ListCreateSerializer(serializers.Serializer):
    name = serializers.CharField()
    desc = serializers.CharField(required=False)