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
        self.comment_detail_url = reverse(
            'comment-detail', kwargs={'comment_id': self.comment.id})
        self.comment_detail_url_not_exist = reverse(
            'comment-detail', kwargs={'comment_id': self.comment.id+2342})
        refresh = RefreshToken.for_user(self.comment.user)
        self.token = refresh.access_token

    @classmethod
    def teadDown(self):
        Recipe.objects.all().delete()
        User.objects.all().delete()

    def test_update_comment(self):
        payload = {
            'text': 'New Description'
        }
        response = self.client.patch(self.comment_detail_url, content_type='application/json',
                                     data=json.dumps(payload), **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        comment = Comment.objects.get(
            pk=json.loads(response.content)['result']['id'])
        self.assertEqual(comment.text, 'New Description')

    def test_update_comment_not_exists(self):
        response = self.client.patch(
            self.comment_detail_url_not_exist, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_comment_no_credentials(self):
        response = self.client.patch(self.comment_detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_comment(self):
        response = self.client.delete(
            self.comment_detail_url, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        comment = Comment.objects.get(pk=self.comment.id)
        self.assertEqual(comment.text, '[deleted]')

    def test_delete_comment_not_exist(self):
        response = self.client.delete(
            self.comment_detail_url_not_exist, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_delete_comment_no_credentials(self):
        response = self.client.delete(
            self.comment_detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_delete_comment_wrong_credentials(self):
        user = UserFactory.create()
        refresh = RefreshToken.for_user(user)
        response = self.client.delete(
            self.comment_detail_url, **{'HTTP_AUTHORIZATION': f'Bearer {refresh.access_token}'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(json.loads(response.content)['detail'],'You do not have permission to perform this action.')
