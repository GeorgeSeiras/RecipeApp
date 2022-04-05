from factory import django, Faker, SubFactory

from list.models import RecipesInList
from user.test.factory import UserFactory


class RecipeInListFactory(django.DjangoModelFactory):
    class Meta:
        model = RecipesInList
        django_get_or_create = ('user', 'list')

    user = 'user'
    list = 'list'
