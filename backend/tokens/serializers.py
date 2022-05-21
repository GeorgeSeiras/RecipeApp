from rest_framework import serializers


class NewTokenSerializer(serializers.ModelSerializer):
    
    email = serializers.EmailField()
