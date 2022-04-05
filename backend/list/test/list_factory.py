from factory import django, Faker,SubFactory,LazyAttribute
from faker import Faker as FakerClass

from user.test.factory import UserFactory
from list.models import List

fake=FakerClass()
class ListFactory(django.DjangoModelFactory):
    class Meta:
        model = List
        django_get_or_create = ('user',)

    user = SubFactory(UserFactory)
    name= LazyAttribute(lambda n: fake.word()[:10])
    desc= LazyAttribute(lambda n: fake.sentence()[:150])
