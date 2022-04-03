from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from factory.fuzzy import FuzzyText
import json

from .factory import UserFactory
from user.models import User


class UserRegisterTest(APITestCase):

    @classmethod
    def setUp(self):
        self.user_object = UserFactory.build()
        self.client = APIClient()
        self.signup_url = reverse('user-register')

    def test_register_user(self):
        data = {
            'username': self.user_object.username,
            'email': self.user_object.email,
            'password': self.user_object.password,
        }

        response = self.client.post(self.signup_url, json.dumps(
            data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username=self.user_object.username)
        self.assertEqual(user.username, self.user_object.username)
        self.assertEqual(user.check_password(self.user_object.password), True)
        self.assertEqual(user.email, self.user_object.email)

    def test_register_missing_username(self):
        data = {
            'password': self.user_object.password,
            'email': self.user_object.email,
        }

        response = self.client.post(self.signup_url, json.dumps(
            data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_missing_email(self):
        data = {
            'password': self.user_object.password,
            'username': self.user_object.username,
        }

        response = self.client.post(self.signup_url, json.dumps(
            data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_missing_password(self):
        data = {
            'username': self.user_object.username,
            'email': self.user_object.email,
        }
        response = self.client.post(self.signup_url, json.dumps(
            data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_password_too_short(self):
        data = {
            'username': self.user_object.username,
            'email': self.user_object.email,
            'password': FuzzyText(length=7).fuzz()
        }

        response = self.client.post(self.signup_url, json.dumps(
            data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertJSONEqual(str(response.content, encoding='utf8'), {
                             'message': 'Password must be atleast 8 characters long', 'status_code': 400})