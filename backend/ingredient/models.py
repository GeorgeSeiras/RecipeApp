from django.db import models

class Ingredient(models.Model):
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    unit = models.CharField(max_length=10, blank=True)
    ingredient = models.CharField(max_length=50,)

    class Meta:
        db_table = 'ingredient'
    def ingredients_to_list(ingredients):
        list = []
        for ingredient in ingredients:
            dict = {}
            dict['amount'] = float(ingredient.amount)
            dict['unit'] = ingredient.unit
            dict['ingredient'] = ingredient.ingredient
            list.append(dict)
        return list