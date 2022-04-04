from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json

from .factory import RecipeFactory, UserFactory


class RecipeQueryTest(APITestCase):

    @classmethod
    def setUp(self):
        self.client = APIClient()
        self.recipe_query_url = reverse('recipe-query')
        self.user = UserFactory.create()
        self.recipe_1 = RecipeFactory.create(
            title='Test Title', user=self.user)
        self.recipe_2 = RecipeFactory.create(
            course=['main', 'appetizer'], cuisine=['chinese', 'korean'])
        self.recipe_3 = RecipeFactory.create()

    def test_query(self):
        #no query params
        response = self.client.get(self.recipe_query_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(json.loads(response.content)['results']), 3)

        #query params = title
        response = self.client.get(self.recipe_query_url, {
                                   'title': self.recipe_1.title})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = json.loads(response.content)['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], self.recipe_1.id)

        #query params = course
        response = self.client.get(self.recipe_query_url, {
                                   'course': self.recipe_2.course[0]})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = json.loads(response.content)['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], self.recipe_2.id)

        #query params = cuisine
        response = self.client.get(self.recipe_query_url, {
                                   'cuisine': self.recipe_2.cuisine[0]})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = json.loads(response.content)['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], self.recipe_2.id)

        #multiple query params
        response = self.client.get(self.recipe_query_url, {
                                   'username': self.recipe_1.user.username})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = json.loads(response.content)['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], self.recipe_1.id)

        response = self.client.get(self.recipe_query_url, {
                                   'username': self.recipe_1.user.username, 'title': self.recipe_1.title})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = json.loads(response.content)['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], self.recipe_1.id)

        #sort asc
        response = self.client.get(self.recipe_query_url, {'sort':'asc'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(json.loads(response.content)['results']), 3)
        results = json.loads(response.content)['results']
        self.assertEqual(results[0]['id'],self.recipe_1.id)

        #sort desc
        response = self.client.get(self.recipe_query_url, {'sort':'desc'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(json.loads(response.content)['results']), 3)
        results = json.loads(response.content)['results']
        self.assertEqual(results[0]['id'],self.recipe_3.id)