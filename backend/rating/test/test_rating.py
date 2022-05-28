from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json

from user.test.utils import generate_token

from .factory import RatingFactory, UserFactory

from user.test.factory import UserFactory
from recipe.test.factory import RecipeFactory

from user.models import User
from recipe.models import Recipe
from rating.models import Rating


class RatingTest(APITestCase):

    @classmethod
    def setUp(self):
        self.user = UserFactory.create()
        self.user_2 = UserFactory.create()
        self.recipe = RecipeFactory.create()
        self.recipe_2 = RecipeFactory.create()
        self.rating = RatingFactory.create(
            user=self.user_2, recipe=self.recipe_2)

        self.client = APIClient()
        self.rating_url = reverse(
            'rating', kwargs={'recipe_id': self.recipe.id})
        self.rating_url_2 = reverse(
            'rating', kwargs={'recipe_id': self.recipe_2.id})
        self.rating_url_not_exist = reverse(
            'rating', kwargs={'recipe_id': self.recipe.id+1231})
        user = User.objects.get(username=self.user.username)
        self.token = generate_token(user)
        self.token_2 = generate_token(self.user_2)

    @classmethod
    def tearDown(self):
        User.objects.all().delete()
        Recipe.objects.all().delete()
        Rating.objects.all().delete()
     
    def test_get_rating(self):
        response = self.client.get(
            self.rating_url_2, **{'HTTP_AUTHORIZATION': f'Bearer {self.token_2}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content)[
                         'result']['id'], self.rating.id)

    def test_get_rating_not_exists(self):
        response = self.client.get(
            self.rating_url_2, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(json.loads(response.content)['result'], None)

    def test_get_rating_no_credentials(self):
        response = self.client.get(self.rating_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_rate_recipe(self):
        response = self.client.put(self.rating_url, json.dumps(
            {'rating': '2'}), content_type='application/json', **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        rating = Rating.objects.filter(recipe=self.recipe.id)
        self.assertEqual(len(rating), 1)

    def test_rate_recipe_recipe_not_exists(self):
        response = self.client.put(self.rating_url_not_exist, json.dumps(
            {'rating': '2'}), content_type='application/json', **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_rate_recipe_no_credentials(self):
        response = self.client.put(self.rating_url, json.dumps(
            {'rating': '2'}), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_rate_invalid_option(self):
        response = self.client.put(self.rating_url, json.dumps(
            {'rating': '6'}), content_type='application/json', **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_rating(self):
        response = self.client.delete(
            self.rating_url_2, **{'HTTP_AUTHORIZATION': f'Bearer {self.token_2}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        rating = Rating.objects.filter(user=self.user_2, recipe=self.recipe_2)
        self.assertEqual(len(rating), 0)

    def test_delete_no_credentials(self):
        response = self.client.delete(self.rating_url_2)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_rating_not_exists(self):
        response = self.client.delete(
            self.rating_url_2, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_rating_recipe_not_exists(self):
        response = self.client.delete(
            self.rating_url_not_exist,  **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)