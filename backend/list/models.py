from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.fields import CharField
from django.db.models.fields.related import ForeignKey, ManyToManyField

from user.models import User
from recipe.models import Recipe

class List(models.Model):
    user_id = ForeignKey(User,on_delete=CASCADE)
    name = CharField(max_length=20)
    desc = CharField(max_length=150)

class RecipesInList(models.Model):
    recipe_id = ForeignKey(Recipe,on_delete=CASCADE)
    list_id = ForeignKey(List,on_delete=CASCADE)