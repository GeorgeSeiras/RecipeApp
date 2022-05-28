from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from factory.fuzzy import FuzzyText
from user.test.utils import generate_token
from user.test.factory import UserFactory

from media_library.models import Folder, FolderImage
from user.models import User


class FolderCreateTest(APITestCase):

    @classmethod
    def setUp(self):
        self.password = FuzzyText('password').fuzz()
        self.user_object = UserFactory.create(
            password_unecrypted=self.password)
        self.client = APIClient()
        self.me_url = reverse('folder-create')
        user = User.objects.get(username=self.user_object.username)
        self.token = generate_token(user)


    @classmethod
    def tearDown(self):
        Folder.objects.all().delete()
        FolderImage.objects.all().delete()
        User.objects.all().delete()

    def test_folder_create_depth_0(self):
        payload = {
            'name': 'name',
            'depth': 0,
        }
        response = self.client.post(
            self.me_url, json.dumps(payload), content_type='application/json', ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = json.loads(response.content)['result']
        folder = Folder.objects.get(pk=data['id'])
        self.assertEqual(folder.name, 'name')
        self.assertEqual(folder.depth, 0)
        self.assertEqual(folder.parent, None)

    def test_folder_create_depth_1(self):
        payload = {
            'name': 'name',
            'depth': 0,
        }

        response = self.client.post(
            self.me_url, json.dumps(payload), content_type='application/json', ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = json.loads(response.content)['result']
        payload_child = {
            'name': 'name',
            'parent': data['id']
        }
        response_child = self.client.post(
            self.me_url, json.dumps(payload_child), content_type='application/json', ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data_child = json.loads(response_child.content)['result']
        folder = Folder.objects.get(pk=data_child['id'])
        self.assertEqual(folder.name, 'name')
        self.assertEqual(folder.depth, 1)
        self.assertEqual(folder.parent.id, data['id'])

    def test_folder_create_depth_wrong_parent(self):
        payload = {
            'name': 'name',
            'parent': 123,
        }
        response = self.client.post(
            self.me_url, json.dumps(payload), content_type='application/json', ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_folder_create_depth_no_creds(self):
        payload = {
            'name': 'name',
            'parent': 123,
        }
        response = self.client.post(
            self.me_url, json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
       