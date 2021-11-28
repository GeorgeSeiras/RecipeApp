from rest_framework import serializers
from user.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','email','username','password')

class UserSerializerNoPassword(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','email','username')

class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()
    