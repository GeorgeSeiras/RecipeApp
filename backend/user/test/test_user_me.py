from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from factory.fuzzy import FuzzyText
from .factory import UserFactory
from rest_framework_simplejwt.tokens import RefreshToken

from user.models import User


class UserMeTest(APITestCase):

    @classmethod
    def setUp(self):
        self.password = FuzzyText('password').fuzz()
        self.user_object = UserFactory.create(
            password_unecrypted=self.password)
        self.client = APIClient()
        self.me_url = reverse('user-me')
        user = User.objects.get(username=self.user_object.username)
        refresh = RefreshToken.for_user(user)
        self.token = refresh.access_token

    def test_get_me(self):
        response = self.client.get(
            self.me_url, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content)[
                         'user']['username'], self.user_object.username)

    def test_get_me_no_credentials(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_user(self):
        data = {
            'username': 'newusername',
            'email': 'email@email.com'
        }
        response = self.client.patch(self.me_url, json.dumps(
            data), content_type='application/json', ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = User.objects.get(pk=self.user_object.id)
        self.assertEqual(user.username, 'newusername')
        self.assertEqual(user.email, 'email@email.com')

    def test_no_credentials(self):
        data = {
            'username': 'newusername',
            'email': 'email@email.com'
        }
        response = self.client.patch(self.me_url, json.dumps(
            data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
