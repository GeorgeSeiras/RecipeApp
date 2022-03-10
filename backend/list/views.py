from django.http.response import JsonResponse
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.views import APIView
from django.db import transaction
from django.db.models import Q

from recipe.serializers import RecipesQuerySerializer
from utils.customPagination import myPagination
from recipe.enum import sort_choices
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
            return JsonResponse({'result': list.to_dict()});


class ListDetail(APIView):

    def get(self, request, list_id):
        try:
            list = List.objects.get(pk=list_id)
        except List.DoesNotExist:
            raise NotFound({'message': 'List does not exist'})
        return JsonResponse({'result': list.to_dict()})

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
                    {"message": "You cannot edit another user's lists"})
            serializer = ListPatchSerializer(data=request.data)
            not serializer.is_valid(raise_exception=True)
            for key, value in serializer.data.items():
                setattr(list, key, value)
            list.save()
            return JsonResponse({'result': list.to_dict()})

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
                    {"message": "You cannot edit another user's lists"})
            list.delete()
            return JsonResponse({'result': 'ok'})


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
            return JsonResponse({'result': recipe_in_list.to_dict()})

    @user_required
    def delete(self, request, list_id,recipe_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({'message': 'User not found'})
            try:
                list = List.objects.get(pk=list_id)
            except List.DoesNotExist:
                raise NotFound({'message': 'List not found'})
            if(user != list.user):
                raise PermissionDenied(
                    {"message':'You cannot edit another user's lists"})
            try:
                recipe = Recipe.objects.get(pk=recipe_id)
            except Recipe.DoesNotExist:
                raise NotFound({'message':'Recipe not found'})
            try:
                recipe_in_list = RecipesInList.objects.get(
                    recipe=recipe, list=list).delete()
            except RecipesInList.DoesNotExist:
                raise NotFound({'message': 'Recipe is not part of the list'})
            return JsonResponse({'result': 'ok'})


class ListRecipes(APIView, myPagination):

    def get(self, request, list_id):
        serializer = RecipesQuerySerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        choices = {value: key for key, value in sort_choices}
        query = Q()
        query &= Q(list=list_id)
        if "username" in serializer.validated_data:
            query &= Q(
                recipe__user__username__iexact=serializer.validated_data["username"])
        if "title" in serializer.validated_data:
            query &= Q(
                recipe__title__icontains=serializer.validated_data["title"])
        if "cuisine" in serializer.validated_data:
            query &= Q(recipe__cuisine__contains=[
                       serializer.validated_data["cuisine"]])
        if "course" in serializer.validated_data:
            query &= Q(recipe__course__contains=[
                       serializer.validated_data["course"]])
        sort = "-recipe__created_at"
        if "sort" in serializer.validated_data:
            if serializer.validated_data["sort"] == choices["asc"]:
                sort = "recipe__created_at"
            elif serializer.validated_data["sort"] == choices["desc"]:
                sort = "-recipe__created_at"
        recipes = RecipesInList.objects.filter(query).order_by(sort)
        objects = RecipesInList.recipes_in_list_to_list(recipes)
        page = self.paginate_queryset(objects, request)
        response = self.get_paginated_response(page)
        return response
