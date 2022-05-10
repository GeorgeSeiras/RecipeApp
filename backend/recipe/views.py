from django.http.response import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied
from django.db import transaction
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType
from hitcount.models import HitCount, Hit
from ipware import get_client_ip

from comment.serializers import CreateCommentSerializer
from comment.models import Comment
from recipe.models import Recipe, Ingredient
from user.models import User
from recipe.serializers import (
    IngredientSerializer,
    RecipeSerializer,
    RecipePatchSerializer,
    RecipesQuerySerializer,
)
from utils.customPagination import myPagination
from utils.custom_exceptions import CustomException
from .enum import sort_choices
from backend.decorators import user_required


class RecipeCreate(APIView):
    @user_required
    def post(self, request):
        with transaction.atomic():
            user = User.objects.get(username=request.user)
            serializer = RecipeSerializer(
                data={**request.data, "user": user.id})
            serializer.is_valid(raise_exception=True)
            recipe = serializer.create()
            return JsonResponse(
                {"result": {"recipe": recipe}}, status=status.HTTP_201_CREATED
            )


class RecipeDetail(APIView):

    def get(self, request, pk):
        try:
            user = User.objects.get(username=request.user)
        except User.DoesNotExist:
            pass
        try:
            recipe = Recipe.objects.get(pk=pk)
            if recipe.removed == True and user.is_staff == False:
                raise CustomException(
                    'This recipe has been removed by an administrator', status.HTTP_400_BAD_REQUEST)
            return JsonResponse({"result": recipe.to_dict()})
        except Recipe.DoesNotExist:
            raise NotFound({"message": "Recipe not found"})

    @user_required
    def patch(self, request, pk):
        with transaction.atomic():
            try:
                recipe = Recipe.objects.get(pk=pk)
            except Recipe.DoesNotExist:
                raise NotFound({"message": "Recipe not found"})
            if recipe.user.username != str(request.user):
                raise PermissionDenied(
                    "You cannot modify another user's recipe")
            serializer = RecipePatchSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            for key, value in serializer.validated_data.items():
                # replaces existing ingredients
                if key == "ingredients":
                    ingredients = []
                    Ingredient.objects.filter(recipe=recipe.id).delete()
                    for ingredient in value:
                        ingredient = IngredientSerializer.create(
                            ingredient, recipe)
                        ingredients.append(ingredient)
                    setattr(recipe, key, ingredients)
                else:
                    setattr(recipe, key, value)
            recipe.save()
            return JsonResponse({"result": recipe.to_dict()})

    @user_required
    def delete(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            raise NotFound({"message": "Recipe not found"})
        try:
            user = User.objects.get(username=request.user)
        except User.DoesNotExist:
            raise NotFound({"message": "User not found"})
        if str(recipe.user) != user.username:
            raise PermissionDenied(
                {"message": "You cannot delete another user's recipe"}
            )
        recipe.delete()
        return JsonResponse({"result": "ok"})


class RecipeCommentsView(APIView, myPagination):
    def get(self, request, recipe_id):
        try:
            recipe = Recipe.objects.get(pk=recipe_id)
        except Recipe.DoesNotExist:
            raise NotFound({"message": "Recipe not found"})
        comments = Comment.objects.filter(recipe=recipe).order_by('-id')
        objects = Comment.comments_to_list_sorted(comments)
        page = self.paginate_queryset(objects, request)
        response = self.get_paginated_response(page)
        return response


class RecipesQuery(APIView, myPagination):
    def get(self, request):
        serializer = RecipesQuerySerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        choices = {value: key for key, value in sort_choices}
        query = Q()
        query &= Q(removed=False)
        if "username" in serializer.validated_data:
            query &= Q(
                user__username__iexact=serializer.validated_data["username"])
        if "title" in serializer.validated_data:
            query &= Q(title__icontains=serializer.validated_data["title"])
        if "cuisine" in serializer.validated_data:
            query &= Q(cuisine__contains=[
                       serializer.validated_data["cuisine"]])
        if "course" in serializer.validated_data:
            query &= Q(course__contains=[serializer.validated_data["course"]])
        sort = "-created_at"
        if "sort" in serializer.validated_data:
            if serializer.validated_data["sort"] == choices["asc"]:
                sort = "created_at"
            elif serializer.validated_data["sort"] == choices["desc"]:
                sort = "-created_at"
            elif serializer.validated_data['sort'] == choices['popular']:
                sort = "-hit_count_generic__hits"
        recipes = Recipe.objects.filter(query).order_by(sort)
        objects = Recipe.recipes_to_list(recipes)
        page = self.paginate_queryset(objects, request)
        response = self.get_paginated_response(page)
        return response


class createCommentView(APIView):

    @user_required
    def post(self, request, recipe_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({'message': 'User not found'})
            serializer = CreateCommentSerializer(
                data={**request.data, 'recipe': recipe_id})
            not serializer.is_valid(raise_exception=True)
            comment = Comment.objects.create(
                user=user, **serializer.validated_data)
            return JsonResponse({'result': comment.to_dict()})


class RecipeHitView(APIView):

    def patch(self, request, recipe_id):
        try:
            recipe = Recipe.objects.get(pk=recipe_id)
            LIMIT_HITS = 1
            LIMIT_PERIOD = {'weeks': 1}
            ctype = ContentType.objects.get_for_model(recipe)
            hitcount, created = HitCount.objects.get_or_create(
                content_type=ctype, object_pk=recipe.pk)
            ip = get_client_ip(request)
            try:
                hit_found = Hit.objects.get(ip=ip, hitcount=hitcount)
                return JsonResponse({'result': 'ok'})
            except Hit.DoesNotExist:
                hit = Hit(
                    session="",
                    hitcount=hitcount,
                    ip=get_client_ip(request),
                    user_agent=""
                )
                hit.save()
                return JsonResponse({'result': 'ok'})
        except Recipe.DoesNotExist:
            raise NotFound({'message': 'Recipe not found'})
