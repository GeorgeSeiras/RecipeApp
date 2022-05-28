from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from user.test.utils import generate_token

from recipe.models import Recipe
from recipe.test.factory import RecipeFactory
from comment.test.factory import CommentFactory
from recipe.test.factory import RecipeFactory
from user.models import User


class RecipeImageTest(APITestCase):

    @classmethod
    def setUp(self):
        self.recipe = RecipeFactory.create()
        self.client = APIClient()
        self.comment = CommentFactory.create(recipe=self.recipe,)
        self.comment_2 = CommentFactory.create(recipe=self.recipe,parent=self.comment)
        self.comment_3 = CommentFactory.create(recipe=self.recipe,parent=self.comment_2)
        self.comment_thread_url = reverse(
            'recipe-comments', kwargs={'recipe_id': self.recipe.id})
        self.comment_thread_url_not_exist = reverse(
            'recipe-comments', kwargs={'recipe_id': self.recipe.id+2342})
        self.token = generate_token(self.recipe.user)


    @classmethod
    def teadDown(self):
        Recipe.objects.all().delete()
        User.objects.all().delete()

    def test_get_recipe_comments(self):
        response = self.client.get(self.comment_thread_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)['results']
        self.assertEqual(data[0]['id'], self.comment.id)
        self.assertEqual(data[0]['children'][0]['id'], self.comment_2.id)

    def test_get_recipe_comments_recipe_not_exist(self):
        response = self.client.get(self.comment_thread_url_not_exist)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(json.loads(response.content)[
                         'message'], 'Recipe not found')
