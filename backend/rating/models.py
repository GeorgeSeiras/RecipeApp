from django.db import models
from django.db.models.deletion import CASCADE

from .enum import rating_choices


class Rating(models.Model):
    user = models.ForeignKey('user.user', on_delete=CASCADE)
    recipe = models.ForeignKey('recipe.recipe', on_delete=CASCADE)
    rating = models.DecimalField(
        max_digits=2, decimal_places=1, choices=rating_choices)

    class Meta:
        unique_together = ('user', 'recipe')

    def to_dict(self):
        dict = {}
        dict['id'] = self.id
        dict['user'] = self.user.user_to_dict()
        dict['rating'] = self.rating
        dict['recipe'] = self.recipe.to_dict()
        return dict
