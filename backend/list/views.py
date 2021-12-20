from django.http.response import JsonResponse
from rest_framework import serializers
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.views import APIView
from django.db import transaction

from utils.custom_exceptions import CustomException
from backend.decorators import user_required
from recipe.models import Recipe
from list.serializers import ListRecipeSerializer, ListCreateSerializer, ListPatchSerializer
from list.models import List, RecipesInList
from user.models import User


class ListCreate(APIView):

    @user_required
    def post(self, request):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({'message': 'User does not exist'})
            serializer = ListCreateSerializer(data=request.data)
            not serializer.is_valid(raise_exception=True)
            list = List.objects.create(user=user, **serializer.data)
            return JsonResponse({
                'status': 'ok',
                'data': list.to_dict()
            })


class ListDetail(APIView):

    def get(self, request, list_id):
        try:
            list = List.objects.get(pk=list_id)
        except List.DoesNotExist:
            raise NotFound({'message': 'List does not exist'})
        return JsonResponse({'status': 'ok', 'data': list.to_dict()})

    @user_required
    def patch(self, request, list_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({'message': 'User does not exist'})
            try:
                list = List.objects.get(pk=list_id)
            except List.DoesNotExist:
                raise NotFound({'message': 'List does not exist'})
            if(user != list.user):
                raise PermissionDenied(
                    {"message":"You cannot edit another user's lists"})
            serializer = ListPatchSerializer(data=request.data)
            not serializer.is_valid(raise_exception=True)
            for key, value in serializer.data.items():
                setattr(list, key, value)
            list.save()
            return JsonResponse({'status': 'ok', 'data': list.to_dict()})

    @user_required
    def delete(self, request, list_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({'message': 'User does not exist'})
            try:
                list = List.objects.get(pk=list_id)
            except List.DoesNotExist:
                raise NotFound({'message': 'List does not exist'})
            if(user != list.user):
                raise PermissionDenied(
                    {"message":"You cannot edit another user's lists"})
            list.delete()
            return JsonResponse({'status': 'ok'})


class ListRecipe(APIView):

    @user_required
    def post(self, request, list_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({'message': 'User does not exist'})
            try:
                list = List.objects.get(pk=list_id)
            except List.DoesNotExist:
                raise NotFound({'message': 'List does not exist'})
            if(user != list.user):
                raise PermissionDenied(
                    {"message':'You cannot edit another user's lists"})
            serializer = ListRecipeSerializer(data=request.data)
            not serializer.is_valid(raise_exception=True)
            try:
                recipe = Recipe.objects.get(pk=serializer.data['recipe'])
            except Recipe.DoesNotExist:
                raise NotFound({'message': 'Recipe does not exist'})
            try:
                list_exists = RecipesInList.objects.get(
                    list=list, recipe=recipe)
            except RecipesInList.DoesNotExist:
                list_exists = None
            if list_exists:
                raise CustomException(
                    'Recipe has already been added to this list', 400)
            recipe_in_list = RecipesInList.objects.create(
                recipe=recipe, list=list)
            return JsonResponse({'status': 'ok', 'data': recipe_in_list.to_dict()})

    @user_required
    def delete(self, request, list_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({'message': 'User does not exist'})
            try:
                list = List.objects.get(pk=list_id)
            except List.DoesNotExist:
                raise NotFound({'message': 'List does not exist'})
            if(user != list.user):
                raise PermissionDenied(
                    {"message':'You cannot edit another user's lists"})
            serializer = ListRecipeSerializer(data=request.data)
            not serializer.is_valid(raise_exception=True)
            try:
                recipe_in_list = RecipesInList.objects.get(
                    recipe=serializer.data['recipe'], list=list).delete()
            except RecipesInList.DoesNotExist:
                raise NotFound({'message': 'Recipe is not part of the list'})
            return JsonResponse({'status': 'ok'})
