from rest_framework import serializers


class NewTokenSerializer(serializers.Serializer):
    
    email = serializers.EmailField()
