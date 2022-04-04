from random import randrange
from factory import django, Faker, SubFactory, post_generation
from django.contrib.auth.hashers import make_password

from user.test.factory import UserFactory
from recipe.models import Ingredient, Recipe


class RecipeFactory(django.DjangoModelFactory):
    class Meta:
        model = Recipe

    def create_array(size=5):
        return []
    user =SubFactory(UserFactory)
    title = Faker('word')
    prep_time = Faker('number')
    cook_time = Faker('number')
    desc = Faker('text')
    cuisine = [Faker('text') for x in range(randrange(5))]
    course = [Faker('text') for x in range(randrange(5))]
    steps = [Faker('lorem') for x in range(randrange(10))]

class IngredientFactory(django.DjangoModelFactory):

    class Meta:
        model = Ingredient

    unit = Faker('word')
    amount = Faker('number')
    ingredient = Faker('word')

    @post_generation
    def recipe(self,create,recipe, **kwargs):
        if not create:
            return
        if recipe:
            self.recipe = recipe

    
