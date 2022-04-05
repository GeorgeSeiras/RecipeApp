from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from rest_framework_simplejwt.tokens import RefreshToken

from user.test.factory import UserFactory
from recipe.models import Recipe
from comment.models import Comment
from recipe.test.factory import RecipeFactory
from .factory import CommentFactory
from recipe.test.factory import RecipeFactory
from user.models import User


class RecipeImageTest(APITestCase):

    @classmethod
    def setUp(self):
        self.recipe = RecipeFactory.create()
        self.client = APIClient()
        self.comment = CommentFactory.create()
        self.comment_2 = CommentFactory.create(parent=self.comment)
        self.comment_3 = CommentFactory.create(parent=self.comment_2)
        self.comment_thread_url = reverse(
            'comments-thread-by-id', kwargs={'comment_id': self.comment_2.id})
        self.comment_thread_url_not_exist = reverse(
            'comments-thread-by-id', kwargs={'comment_id': self.comment.id+2342})
        refresh = RefreshToken.for_user(self.comment.user)
        self.token = refresh.access_token

    @classmethod
    def teadDown(self):
        Recipe.objects.all().delete()
        User.objects.all().delete()

    def test_get_comment_thread(self):
        response = self.client.get(self.comment_thread_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)['results']
        self.assertEqual(data[0]['id'], self.comment_2.id)
        self.assertEqual(data[0]['children'][0]['id'], self.comment_3.id)

    def test_get_comment_thread_not_exist(self):
        response = self.client.get(self.comment_thread_url_not_exist)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(json.loads(response.content)[
                         'message'], 'Comment not found')
