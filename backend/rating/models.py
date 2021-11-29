from django.db import models

from user.models import User
from recipe.models import Recipe

class Rating(models.Model):
    user = models.ManyToManyField(User)
    recipe = models.ManyToManyField(Recipe)
    rating = models.DecimalField(max_digits=2, decimal_places=1)