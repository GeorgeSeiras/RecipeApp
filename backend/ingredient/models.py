from django.db import models
from django.db.models.deletion import CASCADE


class Ingredient(models.Model):
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    unit = models.CharField(max_length=10, blank=True)
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