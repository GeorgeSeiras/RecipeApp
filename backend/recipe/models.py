from django.db import models, connection
from django.contrib.postgres.fields import ArrayField
from django.db.models.deletion import CASCADE
from django.db.models.fields.related import ForeignKey

from user.models import User

class Recipe(models.Model):
    user_id = models.ForeignKey(User, on_delete=CASCADE)
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

class Ingredient(models.Model):
    recipe_id = ForeignKey(Recipe,on_delete=CASCADE)
    amount = models.DecimalField(max_digits=8,decimal_places=2)
    unit = models.CharField(max_length=10)
    ingredient = models.CharField(max_length=50)

    class Meta:
        db_table='ingredient'

class Step(models.Model):
    recipe_id = ForeignKey(Recipe,on_delete=CASCADE)
    step_num = models.IntegerField()
    desc = models.CharField(max_length=100)

    class Meta:
        db_table='step'
