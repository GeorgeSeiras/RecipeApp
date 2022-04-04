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
        refresh = RefreshToken.for_user(self.user_object)
        self.token = refresh.access_token
        self.client = APIClient()
        self.user_by_username_url = reverse('user-by-username', kwargs={'username':self.user_object.username})
        self.user_by_username_not_exists_url = reverse('user-by-username', kwargs={'username':self.user_object.username+'asdasd'})

    def get_user_by_username(self):
        response = self.client.get(self.user_by_username_url)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        data = json.dumps(response.content)['result']
        self.assertEqual(data.id,self.user_object.id)
    def get_user_by_username_not_exists(self):
        response = self.client.get(self.user_by_username_url)
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND)