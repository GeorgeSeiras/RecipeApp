from django.contrib.auth.hashers import make_password
from django.core.exceptions import PermissionDenied
from django.db import transaction
from django.db.models import Q
from django.http.response import JsonResponse
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination

from .models import User
from recipe.models import Recipe
from list.models import List
from .serializers import UserImageSerializer, UserSerializer, UserSerializerNoPassword, UserPatchSerializer, ChangePasswordSerializer
from backend.decorators import user_required, admin_required
from utils.custom_exceptions import CustomException


class UserByUsername(APIView):

    def get(self, request, username):
        cur_user = None
        try:
            cur_user = User.objects.get(username=request.user)
        except User.DoesNotExist:
            pass
        try:
            user = User.objects.get(username=username)
            if cur_user is not None:
                if cur_user.is_staff == True:
                    return JsonResponse({'result': user.to_dict()})
            if user.removed == True:
                raise CustomException(
                    'This user has been removed by an administrator', status.HTTP_400_BAD_REQUEST)
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
                return JsonResponse({'result': 'ok'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            raise NotFound({"message": "User not found"})


class UserRegister(APIView):
    def post(self, request, format=None):
        with transaction.atomic():
            if not 'password' in request.data.keys():
                raise CustomException(
                    'Password required', 400)
            if len(request.data['password']) < 8:
                raise CustomException(
                    'Password must be atleast 8 characters long', 400)
            password = make_password(request.data['password'])
            serializer = UserSerializer(
                data={**request.data, 'password': password})
            serializer.is_valid(raise_exception=True)
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

    def get(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise NotFound({"message": "User not found"})
        lists = List.objects.filter(user=user.id).order_by('-id')
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

    @user_required
    def patch(self, request):
        try:
            with transaction.atomic():
                user = User.objects.get(username=request.user)
                serializer = UserPatchSerializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                username = serializer.validated_data.get('username', None)
                email = serializer.validated_data.get('email', None)
                query = Q()
                if username != None:
                    query |= Q(username__icontains=username)
                if email != None:
                    query |= Q(email__icontains=email)
                user_found = User.objects.filter(query)
                if len(user_found) > 0:
                    raise CustomException(
                        'User with this username and/or email already exists', status.HTTP_400_BAD_REQUEST)
                for key, value in serializer.validated_data.items():
                    setattr(user, key, value)
                user.save()
                return JsonResponse({'result': user.to_dict()})
        except User.DoesNotExist:
            raise NotFound({'message': 'User not found'})


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


class UserImageView(APIView):

    @user_required
    def put(self, request):
        with transaction.atomic():
            serializer = UserImageSerializer(
                data={**request.data.dict()})
            serializer.is_valid(raise_exception=True)
            try:
                user = User.objects.get(username=request.user)

            except User.DoesNotExist:
                raise NotFound({"message": "User not found"})
            user.image = serializer.validated_data['image']
            user.save()
            return JsonResponse({"result": user.to_dict()})

    @user_required
    def delete(self, request):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({"message": "User not found"})
            user.image.delete()
            user.image = None
            user.save()
            return JsonResponse({"result": user.to_dict()})
