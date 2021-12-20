import json
import os

from django.db import models, connection
from django.contrib.postgres.fields import ArrayField
from django.db.models.deletion import CASCADE
from django.dispatch import receiver

from user.models import User

class Ingredient(models.Model):
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    unit = models.CharField(max_length=20, blank=True)
    ingredient = models.CharField(max_length=50,)
    recipe = models.ForeignKey('recipe.recipe', on_delete=CASCADE)

    class Meta:
        db_table = 'ingredient'

    def to_dict(self):
        dict = {}
        dict['id'] = self.pk
        dict['amount'] = float(self.amount)
        dict['unit'] = self.unit
        dict['ingredient'] = self.ingredient
        dict['recipe'] = self.recipe.pk
        return dict

    def ingredients_to_list(ingredients):
        list = []
        for ingredient in ingredients:
            dict = {}
            dict['id'] = ingredient.pk
            dict['amount'] = float(ingredient.amount)
            dict['unit'] = ingredient.unit
            dict['ingredient'] = ingredient.ingredient
            dict['recipe'] = ingredient.recipe.pk
            list.append(dict)
        return list

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
        dict['user'] = User.to_dict(self.user)
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

@receiver(models.signals.post_delete, sender=Recipe)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `Recipe` object is deleted.
    """
    if instance.photo:
        if os.path.isfile(instance.photo.path):
            os.remove(instance.photo.path)

@receiver(models.signals.pre_save, sender=Recipe)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    Deletes old file from filesystem
    when corresponding `MediaFile` object is updated
    with new file.
    """
    if not instance.pk:
        return False

    try:
        old_file = Recipe.objects.get(pk=instance.pk).photo
    except Recipe.DoesNotExist:
        return False

    new_file = instance.photo
    if not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)