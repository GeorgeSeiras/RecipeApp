from random import randrange
from factory import django, Faker, SubFactory, post_generation

from user.test.factory import UserFactory
from recipe.models import Ingredient, Recipe


class RecipeFactory(django.DjangoModelFactory):
    class Meta:
        model = Recipe
        
    user =SubFactory(UserFactory)
    title = Faker('word')
    prep_time = Faker('random_int')
    cook_time = Faker('random_int')
    desc = Faker('text')
    servings = Faker('random_int')
    cuisine = Faker('pylist',value_types='str',nb_elements=5)
    course = Faker('pylist',value_types='str',nb_elements=5)
    steps = Faker('pylist',value_types='str',nb_elements=10)

class IngredientFactory(django.DjangoModelFactory):

    class Meta:
        model = Ingredient

    unit = Faker('word')
    amount = Faker('random_int')
    ingredient = Faker('word')

    @post_generation
    def recipe(self,create,recipe, **kwargs):
        if not create:
            return
        if recipe:
            self.recipe = recipe

    
