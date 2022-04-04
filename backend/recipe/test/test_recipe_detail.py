from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from factory.fuzzy import FuzzyText
from rest_framework_simplejwt.tokens import RefreshToken

from user.models import User
from .factory import UserFactory, RecipeFactory


class RecipeDetailTest(APITestCase):

    @classmethod
    def setUp(self):
        self.client = APIClient()
        self.user_object = UserFactory.create()
        user = User.objects.get(username=self.user_object.username)
        self.recipe = RecipeFactory.create(user=user)
        refresh = RefreshToken.for_user(user)
        self.token = refresh.access_token
        self.recipe2 = RecipeFactory.create()
        refresh2 = RefreshToken.for_user(self.recipe2.user)
        self.token2 = refresh2.access_token
        self.recipe_detail_url = reverse(
            'recipe-detail', kwargs={'pk': self.recipe.id})
        self.recipe_detail_not_exist_url = reverse(
            'recipe-detail', kwargs={'pk': self.recipe.id + 14123})

    def test_get_recipe(self):
        response = self.client.get(self.recipe_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content)[
                         'result']['id'], self.recipe.id)

    def test_get_non_existant_recipe(self):
        response = self.client.get(self.recipe_detail_not_exist_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_recipe(self):
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
        response = self.client.patch(self.recipe_detail_url, data=json.dumps(
            payload), content_type='application/json', **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)['result']
        self.assertEqual(data['title'], 'testrecipe')
        self.assertEqual(data['prep_time'], 1)
        self.assertEqual(data['cook_time'], 1)
        self.assertEqual(data['desc'], 'This is a description')
        self.assertEqual(data['ingredients'][0]['amount'], '10')
        self.assertEqual(data['ingredients'][0]['unit'], 'cups')
        self.assertEqual(data['ingredients'][0]['ingredient'], 'testing')
        self.assertEqual(data['ingredients'][1]['amount'], '1')
        self.assertEqual(data['ingredients'][1]['unit'], 'large')
        self.assertEqual(data['ingredients'][1]['ingredient'], 'onion')

        self.assertEqual(data['servings'], 10)
        self.assertEqual(data['cuisine'], ['greek', 'mediterainian'])
        self.assertEqual(data['course'], ['appetizer', 'meat'])
        self.assertEqual(data['steps'], ['Preheat the oven', 'Dice onions'])

    def test_update_recipe_wrong_credentials(self):
        response = self.client.patch(self.recipe_detail_url, json.dumps(
            {'title': 'title'}), content_type='application/json', **{'HTTP_AUTHORIZATION': f'Bearer {self.token2}'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(json.loads(response.content)[
                         'detail'], "You cannot modify another user's recipe")

    def test_update_recipe_no_credentials(self):
        response = self.client.patch(self.recipe_detail_url, json.dumps(
            {'title': 'title'}), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_non_existant_recipe(self):
        response = self.client.delete(
            self.recipe_detail_not_exist_url, **{'HTTP_AUTHORIZATION': f'Bearer {self.token2}'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_recipe_wrong_credentials(self):
        response = self.client.delete(
            self.recipe_detail_url, **{'HTTP_AUTHORIZATION': f'Bearer {self.token2}'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_non_existant_recipe(self):
        response = self.client.delete(
            self.recipe_detail_url, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
