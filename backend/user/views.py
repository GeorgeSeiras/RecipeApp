from django.contrib.auth.hashers import make_password
from django.db import transaction
from django.http.response import JsonResponse
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.forms.models import model_to_dict
from django.core.serializers import serialize
import json
from .models import User
from recipe.models import Recipe
from .serializers import UserSerializer, UserSerializerNoPassword, UserLoginSerializer
from backend.decorators import user_required, admin_required


class UserList(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializerNoPassword

    @admin_required
    def get(self, request, format=None):
        users = User.objects.defer("password")
        serializer = UserSerializerNoPassword(users, many=True)
        return Response(serializer.data)


class UserDetail(APIView):

    @admin_required
    def get(self, request, pk, format=None):
        try:
            user = User.objects.get(pk=pk)
            return JsonResponse(UserSerializerNoPassword(user).data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            raise NotFound

    @user_required
    def delete(self, request, pk):
        try:
            with transaction.atomic():
                user = User.objects.get(pk=pk)
                if(str(request.user) != user.username):
                    return Response("Cannot delete another user's acount", status=status.HTTP_401_UNAUTHORIZED)
                user.delete()
                return JsonResponse(status=status.HTTP_200_OK)
        except User.DoesNotExist:
            raise NotFound


class UserRegister(APIView):
    def post(self, request, format=None):
        with transaction.atomic():
            serializer = UserSerializer(data=request.data)
            if (not serializer.is_valid()):
                return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            serializer.validated_data['password'] = make_password(
                serializer.validated_data['password'])
            serializer.save()
            res = serializer.data
            del res['password']
            return JsonResponse(res, status=status.HTTP_201_CREATED)


class UserRecipes(APIView):

    @user_required
    def get(self, request):
        try:
            user = User.objects.get(username=request.user)
            recipes = Recipe.objects.filter(user_id=user.id)
            return JsonResponse({
                'status': 'ok',
                'data': Recipe.recipes_to_list(recipes)
            })
        except User.DoesNotExist:
            raise NotFound
