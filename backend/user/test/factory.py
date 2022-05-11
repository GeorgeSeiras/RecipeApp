from factory import django, Faker, LazyAttribute, Sequence
from django.contrib.auth.hashers import make_password
import random
from faker import Faker as FakerClass
from user.models import User
from django.core.files.base import ContentFile

fake = FakerClass()


class UserFactory(django.DjangoModelFactory):
    class Meta:
        model = User

    class Params:
        password_unecrypted = Faker('password')

    username = Sequence(lambda n: fake.text(
        random.randint(5, 58))[:-1] + str(n))
    email = Sequence(lambda n: fake.email(
        random.randint(5, 58))[:-1] + str(n))
    password = LazyAttribute(lambda o:  make_password(o.password_unecrypted))
    image = LazyAttribute(
        lambda _: ContentFile(
            django.ImageField()._make_data(
                {'width': 1024, 'height': 768}
            ), 'example.jpg'
        )
    )
