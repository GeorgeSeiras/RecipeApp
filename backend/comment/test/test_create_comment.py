from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from user.test.utils import generate_token

from recipe.models import Recipe
from comment.models import Comment
from recipe.test.factory import RecipeFactory
from .factory import CommentFactory
from recipe.test.factory import RecipeFactory
from user.models import User


class RecipeCommentCreateTest(APITestCase):

    @classmethod
    def setUp(self):
        self.recipe = RecipeFactory.create()
        self.client = APIClient()
        self.create_comment_url = reverse(
            'comment', kwargs={'recipe_id': self.recipe.id})
        self.create_comment_url_not_exist = reverse(
            'comment', kwargs={'recipe_id': self.recipe.id+2342})
        self.token = generate_token(self.recipe.user)

    @classmethod
    def teadDown(self):
        Recipe.objects.all().delete()
        User.objects.all().delete()

    def test_create_comment(self):
        payload = {
            'text': 'This is a description'
        }
        response = self.client.post(self.create_comment_url, json.dumps(
            payload), content_type='application/json', **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        comment = Comment.objects.get(
            pk=json.loads(response.content)['result']['id'])
        self.assertIsNotNone(comment)

    def test_create_comment_recipe_not_exists(self):
        payload = {
            'text': 'This is a description'
        }
        response = self.client.post(self.create_comment_url_not_exist, json.dumps(
            payload), content_type='application/json', **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_comment_no_credentials(self):
        response = self.client.post(self.create_comment_url_not_exist)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
