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
        blank=True,
        null=True
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

    def to_dict(self):
        dict = {}
        dict['id'] = self.id
        dict['user'] = User.user_to_dict(self.user)
        dict['title'] = self.title
        if(self.photo != ""):
            dict['photo'] = json.dumps(str(self.photo))
        else:
            dict['photo'] = None
        dict['prep_time'] = self.prep_time
        dict['cook_time'] = self.cook_time
        dict['desc'] = self.desc
        dict['sercings'] = self.servings
        dict['cuisine'] = self.cuisine
        dict['course'] = self.course
        dict['created_at'] = str(self.created_at)
        dict['updated_at'] = str(self.updated_at)
        dict['steps'] = self.steps
        ingredients = Ingredient.objects.filter(recipe=self.pk)
        ingredient_list = []
        for ingredient in ingredients:
            ingredient_list.append(ingredient.to_dict())
        dict['ingredients'] = ingredient_list
        return dict

    def recipes_to_list(recipes):
        list=[]
        for recipe in recipes:
            list.append(Recipe.to_dict(recipe))
        return list
