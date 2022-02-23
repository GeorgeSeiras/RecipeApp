from django.contrib.auth.hashers import make_password
from django.core.exceptions import PermissionDenied
from django.db import transaction
from django.http.response import JsonResponse
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination

from .models import User
from recipe.models import Recipe
from list.models import List, RecipesInList
from .serializers import UserSerializer, UserSerializerNoPassword, UserPatchSerializer, ChangePasswordSerializer
from backend.decorators import user_required, admin_required
from utils.custom_exceptions import CustomException


class UserList(APIView, LimitOffsetPagination):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializerNoPassword

    @admin_required
    def get(self, request, format=None):
        users = User.objects.all()
        paginated_queryset = self.paginate_queryset(users, request)
        users_list = User.users_to_list(paginated_queryset)
        paginated_result = self.get_paginated_response(users_list)
        return paginated_result

    @user_required
    def patch(self, request):
        try:
            with transaction.atomic():
                user = User.objects.get(username=request.user)
                serializer = UserPatchSerializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                for key, value in serializer.validated_data.items():
                    setattr(user, key, value)
                user.save()
                return JsonResponse({'result': user.to_dict()})
        except User.DoesNotExist:
            raise NotFound({'message': 'User not found'})


class UserByUsername(APIView):

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            return JsonResponse({'result': user.to_dict()})
        except User.DoesNotExist:
            raise NotFound({"message": "User not found"})


class UserDetail(APIView):

    def get(self, request, pk, format=None):
        try:
            user = User.objects.get(pk=pk)
            return JsonResponse({'result': user.to_dict()})
        except User.DoesNotExist:
            raise NotFound({"message": "User not found"})

    @user_required
    def delete(self, request, pk):
        try:
            with transaction.atomic():
                user = User.objects.get(pk=pk)
                if(str(request.user) != user.username):
                    raise PermissionDenied(
                        {"Cannot delete another user's acount"})
                user.delete()
                return JsonResponse(status=status.HTTP_200_OK)
        except User.DoesNotExist:
            raise NotFound({"message": "User not found"})


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
            return JsonResponse({'result': res}, status=status.HTTP_201_CREATED)


class UserRecipes(APIView, LimitOffsetPagination):

    @user_required
    def get(self, request):
        try:
            user = User.objects.get(username=request.user)
        except User.DoesNotExist:
            raise NotFound({"message": "User not found"})
        recipes = Recipe.objects.filter(user=user.id)
        paginated_queryset = self.paginate_queryset(recipes, request)
        paginated_response = self.get_paginated_response(
            Recipe.recipes_to_list(paginated_queryset))
        return paginated_response


class UserLists(APIView, LimitOffsetPagination):
    @user_required
    def get(self, request):
        try:
            user = User.objects.get(username=request.user)
        except User.DoesNotExist:
            raise NotFound({"message": "User not found"})
        lists = List.objects.filter(user=user.id)
        paginated_queryset = self.paginate_queryset(lists, request)
        paginated_response = self.get_paginated_response(
            List.lists_to_list(paginated_queryset))
        return paginated_response


class UserMe(APIView):

    @user_required
    def get(self, request):
        try:
            user = User.objects.get(username=request.user)
        except User.DoesNotExist:
            raise NotFound({"message": "User not found"})
        return JsonResponse({'user': user.to_dict()})


class ChangePassword(APIView):

    @user_required
    def patch(self, request):
        try:
            user = User.objects.get(username=request.user)
            serializer = ChangePasswordSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            if not user.check_password(serializer.validated_data['password']):
                raise CustomException(
                    'Wrong password', status.HTTP_400_BAD_REQUEST)
            if serializer.validated_data['newPassword1'] != serializer.validated_data['newPassword2']:
                raise CustomException(
                    'Passwords must match', status.HTTP_400_BAD_REQUEST)
            setattr(user, 'password', make_password(
                serializer.validated_data['newPassword1']))
            user.save()
            return JsonResponse({'result': user.to_dict()})
        except User.DoesNotExist:
            raise NotFound({'message': 'User not found'})
