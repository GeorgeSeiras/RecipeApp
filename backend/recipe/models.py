import json

from django.db import models, connection
from django.contrib.postgres.fields import ArrayField
from django.db.models.deletion import CASCADE
from django.db.models.fields.related import ForeignKey

from ingredient.models import Ingredient
from user.models import User


class Recipe(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE)
    title = models.CharField(
        max_length=100
    )
    photo = models.ImageField(
        upload_to='media',
        blank=True
    )
    prep_time = models.IntegerField()
    cook_time = models.IntegerField()
    desc = models.TextField(
        max_length=500,
        blank=True
    )
    servings = models.IntegerField()
    cuisine = ArrayField(
        models.CharField(max_length=30)
    )
    course = ArrayField(
        models.CharField(max_length=30)
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    steps = ArrayField(models.CharField(max_length=200))

    def recipe_to_dict(recipe):
        if recipe == None:
            return None
        dict = {}
        dict['id'] = recipe.pk
        dict['user'] = User.user_to_dict(recipe.user)
        dict['title'] = recipe.title
        if(recipe.photo != ""):
            dict['photo'] = json.dumps(str(recipe.photo))
        dict['prep_time'] = recipe.prep_time
        dict['cook_time'] = recipe.cook_time
        dict['desc'] = recipe.desc
        dict['sercings'] = recipe.servings
        dict['cuisine'] = recipe.cuisine
        dict['course'] = recipe.course
        dict['created_at'] = str(recipe.created_at)
        dict['updated_at'] = str(recipe.updated_at)
        dict['steps'] = recipe.steps
        ingredients = Ingredient.objects.get(recipe=recipe.pk)
        dict['ingredients'] = Ingredient.ingredients_to_list(ingredients)
        return dict

    def recipes_to_list(recipes):
        list=[]
        for recipe in recipes:
            list.append(Recipe.recipe_to_dict(recipe))
        return list
