from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from factory.fuzzy import FuzzyText
from factory import Faker

from .factory import UserFactory
from rest_framework_simplejwt.tokens import RefreshToken

from user.models import User
from recipe.models import Recipe


class RecipeCreateTest(APITestCase):

    @classmethod
    def setUp(self):
        self.user_object = UserFactory.create()
        self.client = APIClient()
        self.create_recipe_url = reverse('recipe-create')
        user = User.objects.get(username=self.user_object.username)
        refresh = RefreshToken.for_user(user)
        self.token = refresh.access_token

    def test_create_recipe(self):
        payload = {
            "title": "testrecipe",
            "prep_time": "1",
            "cook_time": "1",
            "desc": "This is a description",
            "ingredients": [{
                "amount": "10",
                "unit": "cups",
                "ingredient": "testing"
            },
                {
                "amount": "1",
                "unit": "large",
                "ingredient": "onion"
            }],
            "servings": "10",
            "cuisine": ["greek", "mediterainian"],
            "course": ["appetizer", "meat"],
            "steps": [
                "Preheat the oven",
                "Dice onions"
            ]

        }

        response = self.client.post(self.create_recipe_url, data=json.dumps(
            payload), content_type='application/json', **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        recipe = Recipe.objects.all()[0]
        self.assertTrue(recipe)
        self.assertEqual(recipe.id, json.loads(
            response.content)['result']['recipe']['id'])

    def test_create_recipe_missing_data(self):
        response = self.client.post(self.create_recipe_url, data={
        }, content_type='application/json', **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = json.loads(response.content)
        self.assertEqual(
            {'title': ['This field is required.'], 'prep_time': ['This field is required.'], 'cook_time': ['This field is required.'],
             'ingredients': ['This field is required.'], 'servings': ['This field is required.'],
             'cuisine': ['This field is required.'], 'course': ['This field is required.'],
             'steps': ['This field is required.'], 'status_code': 400},
            json.loads(response.content)
        )

    def test_recipe_create_no_auth(self):
        response = self.client.post(self.create_recipe_url, data={},
                                    content_type='application/json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)