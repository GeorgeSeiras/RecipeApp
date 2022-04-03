from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from factory.fuzzy import FuzzyText
from factory import Faker
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
        self.password_url = reverse('user-password')
        user = User.objects.get(username=self.user_object.username)
        refresh = RefreshToken.for_user(user)
        self.token = refresh.access_token

    def test_change_password(self):
        data = {
            'password': self.password,
            'newPassword1': 'newpass',
            'newPassword2': 'newpass'
        }
        response = self.client.patch(
            self.password_url, data=json.dumps(data), content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = User.objects.get(pk=self.user_object.id)
        self.assertTrue(user.check_password('newpass'))

    def test_wront_current_password(self):
        password = FuzzyText().fuzz()
        while(password == self.password):
            password = FuzzyText().fuzz()
        data = {
            'password': password,
            'newPassword1': 'newpass',
            'newPassword2': 'newpass'
        }
        response = self.client.patch(
            self.password_url, data=json.dumps(data), content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(json.loads(response.content)['message'], 'Wrong password')

    
    def test_not_matching_new_password(self):
        password1 = FuzzyText().fuzz()
        password2 = FuzzyText().fuzz()
        data = {
            'password': self.password,
            'newPassword1': password1,
            'newPassword2': password2
        }
        response = self.client.patch(
            self.password_url, data=json.dumps(data), content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(json.loads(response.content)['message'], 'Passwords must match')
