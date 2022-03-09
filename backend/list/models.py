from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.fields import CharField
from django.db.models.fields.related import ForeignKey, ManyToManyField

from user.models import User
from recipe.models import Recipe

class List(models.Model):
    user = ForeignKey(User, on_delete=CASCADE)
    name = CharField(max_length=20)
    desc = CharField(max_length=150)

    def to_dict(self):
        dict = {}
        dict['id'] = self.pk
        dict['user'] = self.user.to_dict()
        dict['name'] = self.name
        dict['desc'] = self.desc
        return dict

    def lists_to_list(lists):
        list = []
        for entry in lists:
            list.append(entry.to_dict())
        return list


class RecipesInList(models.Model):
    recipe = ForeignKey(Recipe, on_delete=CASCADE)
    list = ForeignKey(List, on_delete=CASCADE)

    def to_dict(self):
        dict = {}
        dict['recipe'] = self.recipe.to_dict()
        dict['list'] = self.list.to_dict()
        return dict 

    def recipes_in_list_to_list(recipes_in_list):
        list = []
        for recipe_in_list in recipes_in_list:
            list.append(recipe_in_list.to_dict())
        return list