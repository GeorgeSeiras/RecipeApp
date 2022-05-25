from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from user.test.utils import generate_token

from recipe.models import Recipe
from .list_factory import ListFactory
from .recipe_in_list_factory import RecipeInListFactory
from user.test.factory import UserFactory
from recipe.test.factory import RecipeFactory
from user.models import User
from list.models import List
from list.models import RecipesInList


class GetListRecipesTest(APITestCase):

    @classmethod
    def setUp(self):
        self.user = UserFactory.create()
        self.recipe = RecipeFactory.create()
        self.recipe_2 = RecipeFactory.create()
        self.list = ListFactory(user=self.user)
        self.list_2 = ListFactory()
        self.recipe_in_list = RecipeInListFactory(
            list=self.list, recipe=self.recipe)
        self.client = APIClient()
        self.list_recipe_url = reverse(
            'list-recipe', kwargs={'list_id': self.list.id,'recipe_id':self.recipe.id})
        self.list_recipe_url_2 = reverse(
            'list-recipe', kwargs={'list_id': self.list.id,'recipe_id':self.recipe_2.id})
        self.list_recipe_url_list_not_exists = reverse(
            'list-recipe', kwargs={'list_id': self.list.id+123123,'recipe_id':self.recipe.id})
        self.list_recipe_url_recipe_not_exists = reverse(
            'list-recipe', kwargs={'list_id': self.list.id,'recipe_id':self.recipe.id+234323})
        self.token = generate_token(self.user)
        self.token = generate_token(self.list_2.user)

    @classmethod
    def tearDown(self):
        User.objects.all().delete()
        List.objects.all().delete()
        RecipesInList.objects.all().delete()
        Recipe.objects.all().delete()

    def test_add_recipe_to_list(self):
        response = self.client.post(self.list_recipe_url_2,**{'HTTP_AUTHORIZATION':f'Bearer {self.token}'})
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        recipe_in_list = RecipesInList.objects.get(list_id=self.list.id,recipe_id=self.recipe_2.id)
        self.assertIsNotNone(recipe_in_list)

    def test_add_recipe_to_list_no_credentials(self):
        response = self.client.post(self.list_recipe_url_2)
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
    
    def test_add_recipe_to_list_recipe_not_exist(self):
        response = self.client.post(self.list_recipe_url_list_not_exists,**{'HTTP_AUTHORIZATION':f'Bearer {self.token}'})
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND)
        self.assertEqual(json.loads(response.content)['message'],'List not found')

    def test_add_recipe_to_list_list_not_exist(self):
        response = self.client.post(self.list_recipe_url_recipe_not_exists,**{'HTTP_AUTHORIZATION':f'Bearer {self.token}'})
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND)
        self.assertEqual(json.loads(response.content)['message'],'Recipe not found')

    def test_add_recipe_to_list_recipe_already_exists(self):
        response = self.client.post(self.list_recipe_url,**{'HTTP_AUTHORIZATION':f'Bearer {self.token}'})
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertEqual(json.loads(response.content)['message'],'Recipe has already been added to this list')

    def test_add_recipe_to_list_wrong_credentials(self):
        response = self.client.post(self.list_recipe_url_2,**{'HTTP_AUTHORIZATION':f'Bearer {self.token_2}'})
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        self.assertEqual(json.loads(response.content)['message'],"You cannot edit another user\'s lists")

    def test_delete_recipe_from_list(self):
        response = self.client.delete(self.list_recipe_url,**{'HTTP_AUTHORIZATION':f'Bearer {self.token}'})
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        recipe_in_list = RecipesInList.objects.filter(list_id=self.list.id,recipe_id=self.recipe_2.id)
        self.assertEqual(len(recipe_in_list),0)

    def test_delete_recipe_from_list_no_credentials(self):
        response = self.client.delete(self.list_recipe_url_2)
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
    
    def test_delete_recipe_from_list_recipe_not_exist(self):
        response = self.client.delete(self.list_recipe_url_list_not_exists,**{'HTTP_AUTHORIZATION':f'Bearer {self.token}'})
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND)
        self.assertEqual(json.loads(response.content)['message'],'List not found')

    def test_delete_recipe_from_list_list_not_exist(self):
        response = self.client.delete(self.list_recipe_url_recipe_not_exists,**{'HTTP_AUTHORIZATION':f'Bearer {self.token}'})
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND)
        self.assertEqual(json.loads(response.content)['message'],'Recipe not found')

    def test_delete_recipe_from_list_wrong_credentials(self):
        response = self.client.delete(self.list_recipe_url_2,**{'HTTP_AUTHORIZATION':f'Bearer {self.token_2}'})
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        self.assertEqual(json.loads(response.content)['message'],"You cannot edit another user\'s lists")