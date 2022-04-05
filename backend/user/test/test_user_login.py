from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from factory.fuzzy import FuzzyText

from .factory import UserFactory
from user.models import User


class UserLoginTest(APITestCase):

    @classmethod
    def setUp(self):
        self.password = FuzzyText('password').fuzz()
        self.user_object = UserFactory.create(
            password_unecrypted=self.password)
        self.client = APIClient()
        self.login_url = reverse('token_obtain_pair')

    @classmethod
    def tearDown(self):
        User.objects.all().delete()
        
    def test_login(self):
        data = {
            "username": self.user_object.username,
            "password": self.password
        }
        response = self.client.post(self.login_url,
                                    json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(json.loads(response.content)['access'])

    def test_wrong_username(self):
        data = {
            "username": FuzzyText('word').fuzz(),
            "password": self.password
        }
        response = self.client.post(self.login_url,
                                    json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_wrong_password(self):
        data = {
            "username": self.user_object.username,
            "password": FuzzyText('password').fuzz()
        }
        response = self.client.post(self.login_url,
                                    json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wrong_username_and_password(self):
            data = {
                "username": FuzzyText('word').fuzz(),
                "password": FuzzyText('password').fuzz()
            }
            response = self.client.post(self.login_url,
                                        json.dumps(data), content_type='application/json')
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
