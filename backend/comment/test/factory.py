from factory import django, SubFactory, Faker, django

from comment.models import  Comment
from recipe.test.factory import RecipeFactory
from user.test.factory import UserFactory

class CommentFactory(django.DjangoModelFactory):
    class Meta:
        model = Comment

    user = SubFactory(UserFactory)
    recipe = SubFactory(RecipeFactory)
    text = Faker('paragraph')
    deleted = False
