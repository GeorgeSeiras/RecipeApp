from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from rest_framework_simplejwt.tokens import RefreshToken

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
        self.list_without_recipe = ListFactory(user=self.user)
        self.recipe_in_list = RecipeInListFactory(
            list=self.list, recipe=self.recipe)
        self.recipe_in_list_2 = RecipeInListFactory(
            list=self.list, recipe=self.recipe_2
        )
        self.client = APIClient()
        self.list_recipes_url = reverse(
            'list-get-recipes', kwargs={'list_id': self.list.id})
        self.list_recipes_url_empty = reverse(
            'list-get-recipes', kwargs={'list_id': self.list_without_recipe.id})
        self.list_recipes_url_not_exists = reverse(
            'list-get-recipes', kwargs={'list_id': self.list.id+123123})

    @classmethod
    def tearDown(self):
        User.objects.all().delete()
        List.objects.all().delete()
        RecipesInList.objects.all().delete()
        Recipe.objects.all().delete()

    def test_get_list_recipes(self):
        response = self.client.get(self.list_recipes_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)['results']
        self.assertEqual(len(data), 2)
        self.assertCountEqual([data[0]['recipe']['id'], data[1]['recipe']['id']], [
                              self.recipe.id, self.recipe_2.id])

    def test_get_list_with_no_recipes(self):
        response = self.client.get(self.list_recipes_url_empty)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)['results']
        self.assertEqual(len(data), 0)

    def test_get_list_with_recipe_not_exist(self):
        response = self.client.get(
            self.list_recipes_url_not_exists)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(json.loads(response.content)[
                         'detail'], 'List not found')

    def test_query_list_with_recipes(self):
        response = self.client.get(self.list_recipes_url, {
                                   'username': self.recipe.user.username})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data['results']),1)
        self.assertEqual(data['results'][0]['recipe']['id'], self.recipe.id)
        response = self.client.get(self.list_recipes_url, {
                                   'title': self.recipe.title})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data['results']),1)
        self.assertEqual(data['results'][0]['recipe']['id'], self.recipe.id)
        response = self.client.get(self.list_recipes_url, {
                                   'cuisine': self.recipe.cuisine[0]})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data['results']),1)
        self.assertEqual(data['results'][0]['recipe']['id'], self.recipe.id)
        response = self.client.get(self.list_recipes_url, {
                                   'course': self.recipe.course[0]})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data['results']),1)
        self.assertEqual(data['results'][0]['recipe']['id'], self.recipe.id)
        response = self.client.get(self.list_recipes_url, {
                                   'sort': 'asc'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data['results']),2)
        self.assertEqual(data['results'][0]['recipe']['id'], self.recipe.id)
        response = self.client.get(self.list_recipes_url, {
                                   'sort': 'desc'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data['results']),2)
        self.assertEqual(data['results'][0]['recipe']['id'], self.recipe_2.id)