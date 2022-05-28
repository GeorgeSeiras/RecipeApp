from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from factory.fuzzy import FuzzyText
from user.test.utils import generate_token
from media_library.test.mediaFactory import FolderFactory, FolderImageFactory
from user.test.factory import UserFactory

from media_library.models import Folder, FolderImage
from user.models import User


class GetMediaAndFoldersTest(APITestCase):

    @classmethod
    def setUp(self):
        self.password = FuzzyText('password').fuzz()
        self.user_object = UserFactory.create(
            password_unecrypted=self.password)
        self.client = APIClient()
        self.folder = FolderFactory.create(user=self.user_object, depth=0)
        self.me_url = reverse(
            'folder-view', kwargs={'folder_id': self.folder.id})
        user = User.objects.get(username=self.user_object.username)
        self.token = generate_token(user)


    @ classmethod
    def tearDown(self):
        Folder.objects.all().delete()
        FolderImage.objects.all().delete()
        User.objects.all().delete()

    def test_get_folders_and_media_patch(self):
        payload = {'name': 'newname'}
        response = self.client.patch(
            self.me_url, json.dumps(payload), content_type='application/json', ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        folder = Folder.objects.get(pk=self.folder.id)
        self.assertEqual(folder.name, 'newname')

    def test_get_folders_and_media_delete(self):
        response = self.client.delete(
            self.me_url,  ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        folder = Folder.objects.filter(pk=self.folder.id)
        self.assertEqual(len(folder), 0)

    def test_get_folders_and_media_no_creds(self):
        payload = {'name': 'newname'}
        response = self.client.patch(
            self.me_url, json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.delete(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
