from factory import django, Faker, SubFactory
from list.test.list_factory import ListFactory
from recipe.test.factory import RecipeFactory

from list.models import RecipesInList
from user.test.factory import UserFactory


class RecipeInListFactory(django.DjangoModelFactory):
    class Meta:
        model = RecipesInList

    recipe = SubFactory(RecipeFactory)
    list = SubFactory(ListFactory)
