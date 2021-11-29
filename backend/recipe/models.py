from django.db import models
from django.contrib.postgres.fields import ArrayField

class Recipe(models.Model):
    title = models.CharField(
        max_length=100
    )
    picture = models.ImageField(
        upload_to='media'
    )
    prep_time = models.IntegerField(
        max_length=5
    )
    cook_time = models.IntegerField(
        max_length=5
    )
    desc = models.TextField(
        max_length=500
    )
    #ingredients
    servings = models.IntegerField(
        max_length=2
    )
    cuisine = ArrayField(
        models.CharField(max_length=30)
    )
    course = ArrayField(
        models.CharField(max_length=30)
    )
    #rating =  
    #steps = 
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )