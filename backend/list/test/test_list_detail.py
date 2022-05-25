from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json

from user.test.utils import generate_token

from .list_factory import ListFactory
from user.test.factory import UserFactory

from user.models import User
from list.models import List


class ListDetailTest(APITestCase):

    @classmethod
    def setUp(self):
        self.user = UserFactory.create()
        self.list = ListFactory(user=self.user)
        self.client = APIClient()
        self.list_detail_url = reverse(
            'list-detail', kwargs={'list_id': self.list.id})
        self.list_detail_url_not_exist = reverse(
            'list-detail', kwargs={'list_id': self.list.id+123123})
        self.token = generate_token(self.user)

    @classmethod
    def tearDown(self):
        User.objects.all().delete()
        List.objects.all().delete()

    def test_get_list(self):
        response = self.client.get(self.list_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.list.id, json.loads(
            response.content)['result']['id'])

    def test_get_list_not_exist(self):
        response = self.client.get(self.list_detail_url_not_exist)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_list(self):
        payload = {'name': 'newname', 'desc': 'newdesc'}
        response = self.client.patch(self.list_detail_url, json.dumps(
            payload), content_type='application/json', **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        list = List.objects.get(pk=self.list.id)
        self.assertEqual(list.name, 'newname')
        self.assertEqual(list.desc, 'newdesc')

    def test_update_list_no_credentials(self):
        response = self.client.patch(self.list_detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_list_wrong_credentials(self):
        user = UserFactory.create()
        token = generate_token(user)
        response = self.client.patch(
            self.list_detail_url, **{'HTTP_AUTHORIZATION': f'Bearer {token}'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(json.loads(response.content)[
                         'message'], "You cannot edit another user's lists")

    def test_delete_list(self):
        response = self.client.delete(
            self.list_detail_url, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        list_count = List.objects.filter(pk=self.list.id).count()
        self.assertEqual(list_count, 0)

    def test_delete_list_no_credentials(self):
        response = self.client.delete(self.list_detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_list_wrong_credentials(self):
        user = UserFactory.create()
        token = generate_token(user)
        response = self.client.delete(
            self.list_detail_url, **{'HTTP_AUTHORIZATION': f'Bearer {token}'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(json.loads(response.content)[
                         'message'], "You cannot edit another user's lists")
