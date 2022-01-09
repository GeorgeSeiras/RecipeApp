from django.http.response import JsonResponse
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied
from django.db import transaction

from comment.models import Comment
from recipe.models import Recipe, Ingredient
from user.models import User
from recipe.serializers import (
    IngredientCreateSerializer,
    IngredientPatchSerializer,
    IngredientSerializer,
    RecipeSerializer,
    RecipePatchSerializer,
    StepCreateSerializer,
)
from backend.decorators import admin_required, user_required


class RecipeCreate(APIView):
    @user_required
    def post(self, request):
        with transaction.atomic():
            user = User.objects.get(username=request.user)
            serializer = RecipeSerializer(
                data={**request.data, "user": user.id}
            )
            serializer.is_valid(raise_exception=True)
            recipe = serializer.create()
            return JsonResponse(
                {"result": {"recipe": recipe}}, status=status.HTTP_201_CREATED
            )


class RecipeDetail(APIView):
    def get(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk)
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
                raise PermissionDenied({"You cannot modify another user's recipe"})
            serializer = RecipePatchSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            for key, value in serializer.validated_data.items():
                # replaces existing ingredients
                if key == "ingredients":
                    ingredients = []
                    Ingredient.objects.filter(recipe=recipe.id).delete()
                    for ingredient in value:
                        ingredient = IngredientSerializer.create(
                            self, ingredient, recipe
                        )
                        ingredients.append(ingredient)
                    setattr(recipe, key, ingredients)
            recipe.save()
            res = Recipe.objects.filter(pk=recipe.id)
            return JsonResponse({"result": Recipe.recipes_to_list(res)})

    @user_required
    def delete(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk)
        except User.DoesNotExist:
            raise NotFound({"message": "User not found"})
        try:
            user = User.objects.get(username=request.user)
        except Recipe.DoesNotExist:
            raise NotFound({"message": "recipe not found"})
        if str(recipe.user) != user.username:
            raise PermissionDenied(
                {"message": "You cannot delete another user's recipe"}
            )
        recipe.delete()
        return JsonResponse({"status": "ok"})


""" is this needed???"""


class RecipeIngredients(APIView, LimitOffsetPagination):
    def get(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            raise NotFound({"message": "Recipe not found"})
        paginated_queryset = self.paginate_queryset(recipe)
        paginated_response = self.get_paginated_response(
            recipe.to_dict()["ingredients"]
        )
        return paginated_response


class IngredientCreate(APIView):
    @user_required
    def post(self, request, recipe_id):
        with transaction.atomic():
            user = User.objects.get(username=request.user)
            serializer = IngredientCreateSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            recipe = Recipe.objects.get(pk=recipe_id)
            if recipe.user.id != user.id:
                raise PermissionDenied
            res = IngredientSerializer.create(self, serializer.validated_data, recipe)
            return JsonResponse(
                {"result": res.to_dict()}, status=status.HTTP_201_CREATED
            )


class IngredientDetail(APIView):
    @user_required
    def patch(self, request, recipe_id, ingr_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({"message": "User not found"})
            try:
                recipe = Recipe.objects.get(pk=recipe_id)
            except Recipe.DoesNotExist:
                raise NotFound("Recipe does not exist")
            try:
                ingredient = Ingredient.objects.get(pk=ingr_id)
            except Ingredient.DoesNotExist:
                raise NotFound({"message": "Ingredient not found"})
            if recipe.user.id != user.id:
                raise PermissionDenied(
                    {"message": "You cannot modify another user's recipe"}
                )
            serializer = IngredientPatchSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            for key, value in serializer.data.items():
                setattr(ingredient, key, value)
            ingredient.save()
            return JsonResponse({"result": ingredient.to_dict()})

    @user_required
    def delete(self, request, recipe_id, ingr_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({"message": "User not found"})
            try:
                recipe = Recipe.objects.get(pk=recipe_id)
            except Recipe.DoesNotExist:
                raise NotFound("Recipe does not exist")
            try:
                ingredient = Ingredient.objects.get(pk=ingr_id)
            except Ingredient.DoesNotExist:
                raise NotFound({"message": "Ingredient not found"})
            if recipe.user.id != user.id:
                raise PermissionDenied(
                    {"message": "You cannot delete another user's ingredient"}
                )
            ingredient.delete()
            return JsonResponse({"status": "ok"})


class StepCreateView(APIView):
    @user_required
    def post(self, request, recipe_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({"message": "User not found"})
            try:
                recipe = Recipe.objects.get(pk=recipe_id)
            except Recipe.DoesNotExist:
                raise NotFound("Recipe does not exist")
            if recipe.user.id != user.id:
                raise PermissionDenied(
                    {"message": "You cannot mofidy another user's recipe"}
                )
            serializer = StepCreateSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            pos = serializer.data.get("pos", None)
            if pos != None:
                recipe.steps.insert(pos, serializer.data["step"])
            else:
                recipe.steps.append(serializer.data["step"])
            recipe.save()
            return JsonResponse(
                {"result": recipe.to_dict()}, status=status.HTTP_201_CREATED
            )


class RecipeCommentsView(APIView, LimitOffsetPagination):
    def get(self, request, recipe_id):
        try:
            recipe = Recipe.objects.get(pk=recipe_id)
        except Recipe.DoesNotExist:
            raise NotFound({"message": "Recipe does not exist"})
        comments = Comment.objects.filter(recipe=recipe)
        objects = Comment.comments_to_list_sorted(comments)
        page = self.paginate_queryset(objects, request)
        response = self.get_paginated_response(page)
        return response
