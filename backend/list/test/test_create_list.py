from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json

from user.test.factory import UserFactory
from rest_framework_simplejwt.tokens import RefreshToken

from user.models import User
from list.models import List


class RecipeCreateTest(APITestCase):

    @classmethod
    def setUp(self):
        self.user_object = UserFactory.create()
        self.client = APIClient()
        self.create_list_url = reverse('list-create')
        user = User.objects.get(username=self.user_object.username)
        refresh = RefreshToken.for_user(user)
        self.token = refresh.access_token

    @classmethod
    def tearDown(self):
        User.objects.all().delete()
        List.objects.all().delete()

    def test_create_list(self):
        payload = {'name': 'name', 'desc': 'desc'}
        response = self.client.post(self.create_list_url, json.dumps(
            payload), content_type='application/json', **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        list = List.objects.get(pk=json.loads(
            response.content)['result']['id'])
        self.assertEqual(list.name, 'name')
        self.assertEqual(list.desc, 'desc')

    def test_create_list_missing_name(self):
        response = self.client.post(self.create_list_url, {}, content_type='application/json', **{
                                    'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = json.loads(response.content)
        self.assertEqual(data['name'], ['This field is required.'])

    def test_create_list_no_credentials(self):
        response = self.client.post(self.create_list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
