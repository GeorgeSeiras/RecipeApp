from factory import django, SubFactory, Iterator

from recipe.test.factory import RecipeFactory
from user.test.factory import UserFactory
from rating.models import Rating

rating_choices = [
    0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0
]


class RatingFactory(django.DjangoModelFactory):
    class Meta:
        model = Rating

    recipe = SubFactory(RecipeFactory)
    user = SubFactory(UserFactory)
    rating = Iterator(rating_choices)
