from django.db import models
from django.contrib.postgres.fields import ArrayField

class Ingredient(models.Model):
    id = models.BigIntegerField(primary_key=True, db_column='ingredient_id')
    amount = models.DecimalField(max_digits=8,decimal_places=2)
    unit = models.CharField(max_length=10)
    ingredient = models.CharField(max_length=50)

    class Meta:
        db_table='ingredient'
    
class Step(models.Model):
    id = models.BigIntegerField(primary_key=True, db_column='step_id')
    step_num = models.IntegerField()
    desc = models.CharField(max_length=100)

    class Meta:
        db_table='step'

class Recipe(models.Model):
    title = models.CharField(
        max_length=100
    )
    picture = models.ImageField(
        upload_to='media'
    )
    prep_time = models.IntegerField()
    cook_time = models.IntegerField()
    desc = models.TextField(
        max_length=500
    )
    ingredients = models.ForeignKey(Ingredient,models.DO_NOTHING,default=None)
    servings = models.IntegerField()
    cuisine = ArrayField(
        models.CharField(max_length=30)
    )
    course = ArrayField(
        models.CharField(max_length=30)
    )
    steps = models.ForeignKey(Step,models.DO_NOTHING,default=None) 
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )

   
