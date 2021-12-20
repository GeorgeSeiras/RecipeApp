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

from .models import User
from recipe.models import Recipe
from list.models import List
from .serializers import UserSerializer, UserSerializerNoPassword
from backend.decorators import user_required, admin_required


class UserList(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializerNoPassword

    @admin_required
    def get(self, request, format=None):
        users = User.objects.all()
        users_list = User.users_to_list(users)
        return JsonResponse({
            'status':'ok',
            'data': users_list
        })


class UserDetail(APIView):

    @admin_required
    def get(self, request, pk, format=None):
        try:
            user = User.objects.get(pk=pk)
            return JsonResponse(UserSerializerNoPassword(user).data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            raise NotFound({"message":"User not found"})

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
            raise NotFound({"message":"User not found"})


class UserRegister(APIView):
    def post(self, request, format=None):
        with transaction.atomic():
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
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
        except User.DoesNotExist:
            raise NotFound({"message":"User not found"})
        recipes = Recipe.objects.filter(user=user.id)
        return JsonResponse({
            'status': 'ok',
            'data': Recipe.recipes_to_list(recipes)
        })


class UserLists(APIView):
    @user_required
    def get(self, request):
        try:
            user = User.objects.get(username=request.user)
            lists = List.objects.filter(user=user.id)
            return JsonResponse({
                'status': 'ok',
                'data': List.lists_to_list(lists)
            })
        except User.DoesNotExist:
            raise NotFound({"message":"User not found"})