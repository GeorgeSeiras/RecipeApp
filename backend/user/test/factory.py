import email
from factory import django, Faker, SubFactory, LazyAttribute, Sequence
from django.contrib.auth.hashers import make_password
import random
from faker import Faker as FakerClass
from user.models import User
from image.test.factory_user import UserImageFactory

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
    image = SubFactory(UserImageFactory)
