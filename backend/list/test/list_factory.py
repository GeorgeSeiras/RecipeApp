from typing import List
from factory import django, Faker

from list.models import List

class ListFactory(django.DjangoModelFactory):
    class Meta:
        model = List
        django_get_or_create = ('user')

    user = 'user'
    name = Faker('word')
    desc = Faker('text')
