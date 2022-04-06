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
        self.user_by_id_exists_url = reverse('user-by-id',kwargs={'pk': self.user_object.id})
        self.user_by_id_not_exists_url = reverse('user-by-id',kwargs={'pk': self.user_object.id + 1})

    @classmethod
    def tearDown(self):
        User.objects.all().delete()
        
    def test_get_user_by_id(self):
        response = self.client.get(self.user_by_id_exists_url)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        data = json.loads(response.content)['result']
        self.assertEqual(data['id'],self.user_object.id)
        self.assertEqual(data['image']['id'],self.user_object.image.id)
    
    def test_get_user_by_id_not_exists(self):
        response = self.client.get(self.user_by_id_not_exists_url)
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND)

    def test_delete_user_not_authenticated(self):
        response = self.client.delete(self.user_by_id_not_exists_url)
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)

    def test_delete_user_other_user(self):
        user2 = UserFactory.create()
        refresh = RefreshToken.for_user(user2)
        token = refresh.access_token
        response = self.client.delete(self.user_by_id_exists_url, **{'HTTP_AUTHORIZATION': f'Bearer {token}'})
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        self.assertEqual(json.loads(response.content)['detail'], 'You do not have permission to perform this action.')
    
    def test_delete_user(self):
        response = self.client.delete(self.user_by_id_exists_url, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.filter(username=self.user_object.username).count(),0)
