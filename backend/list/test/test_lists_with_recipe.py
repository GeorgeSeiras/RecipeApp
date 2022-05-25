from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json

from user.test.utils import generate_token

from .list_factory import ListFactory
from .recipe_in_list_factory import RecipeInListFactory
from user.test.factory import UserFactory
from recipe.test.factory import RecipeFactory
from user.models import User
from list.models import List


class ListsWithRecipeTest(APITestCase):

    @classmethod
    def setUp(self):
        self.user = UserFactory.create()
        self.recipe = RecipeFactory.create()
        self.list = ListFactory(user=self.user)
        self.list_without_recipe = ListFactory(user=self.user)
        self.recipe_in_list = RecipeInListFactory(
            list=self.list, recipe=self.recipe)
        self.client = APIClient()
        self.list_detail_url = reverse(
            'lists-with-recipe', kwargs={'recipe_id': self.recipe.id})
        self.list_detail_url_not_exist = reverse(
            'lists-with-recipe', kwargs={'recipe_id': self.recipe.id+123123})
        self.token = generate_token(self.user)

    @classmethod
    def tearDown(self):
        User.objects.all().delete()
        List.objects.all().delete()

    def test_get_lists_with_recipe(self):
        response = self.client.get(self.list_detail_url,**{'HTTP_AUTHORIZATION':f'Bearer {self.token}'})
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        data = json.loads(response.content)['result']
        self.assertEqual(len(data),1)
        self.assertEqual(data[0],self.list.id)
    
    def test_get_lists_with_recipe_not_exist(self):
        response = self.client.get(self.list_detail_url_not_exist,**{'HTTP_AUTHORIZATION':f'Bearer {self.token}'})
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND)
        self.assertEqual(json.loads(response.content)['message'],'Recipe not found')

    def test_get_lists_with_recipe_no_credentials(self):
        response = self.client.get(self.list_detail_url)
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)

 