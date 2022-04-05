from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json

from .factory import RatingFactory, UserFactory
from rest_framework_simplejwt.tokens import RefreshToken

from user.test.factory import UserFactory
from recipe.test.factory import RecipeFactory

from user.models import User
from recipe.models import Recipe
from rating.models import Rating


class RatingTest(APITestCase):

    @classmethod
    def setUp(self):
        self.recipe = RecipeFactory.create()
        self.recipe_2 = RecipeFactory.create()
        self.rating = RatingFactory.create(recipe=self.recipe)
        self.rating_2 = RatingFactory.create(recipe=self.recipe)
        self.client = APIClient()
        self.rating_url = reverse(
            'rating-average', kwargs={'recipe_id': self.recipe.id})
        self.rating_url_2 = reverse(
            'rating-average', kwargs={'recipe_id': self.recipe_2.id})
        self.rating_url_not_exist = reverse(
            'rating-average', kwargs={'recipe_id': self.recipe.id+1231})

    @classmethod
    def tearDown(self):
        User.objects.all().delete()
        Recipe.objects.all().delete()
        Rating.objects.all().delete()
        
    def test_get_rating_avg(self):
        response = self.client.get(self.rating_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)['result']['rating__avg']
        avg=Decimal((self.rating.rating + self.rating_2.rating)/2)
        self.assertEqual(f'{Decimal(data):.2f}', f'{avg:.2f}')

    def test_get_rating_avg_no_rating(self):
        response = self.client.get(self.rating_url_2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)['result']['rating__avg']
        self.assertEqual(data,None)
    
    def test_get_rating_average_recipe_not_exist(self):
        response = self.client.get(self.rating_url_not_exist)
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND)
        self.assertEqual(json.loads(response.content)['message'],'Recipe not found')