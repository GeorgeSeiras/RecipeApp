from factory import django, Faker, SubFactory, LazyAttribute
from django.contrib.auth.hashers import make_password
from faker.providers import person
from user.models import User
from image.test.factory_user import UserImageFactory

class UserFactory(django.DjangoModelFactory):
    class Meta:
        model = User

    class Params:
        password_unecrypted = Faker('password')

    username =  Faker('first_name')
    email = Faker('email')
    password = LazyAttribute(lambda o:  make_password(o.password_unecrypted))
    image = SubFactory(UserImageFactory)
