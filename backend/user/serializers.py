from rest_framework import serializers
from user.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'image']


class UserSerializerNoPassword(serializers.ModelSerializer):
    model = serializers.SerializerMethodField('model_name')

    def model_name(self, object):
        return 'user'

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'image', 'model')


class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()


class UserPatchSerializer(serializers.Serializer):
    email = serializers.CharField(required=False)
    username = serializers.CharField(required=False)


class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField()
    newPassword1 = serializers.CharField()
    newPassword2 = serializers.CharField()


class UserImageSerializer(serializers.Serializer):
    image = serializers.ImageField()
