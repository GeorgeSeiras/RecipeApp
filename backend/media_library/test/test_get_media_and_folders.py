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
        self.folder_1 = FolderFactory.create(user=self.user_object,depth=0)
        self.folder_2 = FolderFactory.create(
            parent=self.folder_1, user=self.user_object,depth=1)
        self.media = []
        for i in range(0, 20):
            self.media.append(FolderImageFactory.create(
                folder=self.folder_2))
        self.me_url= reverse('get-media-and-folders')
        user = User.objects.get(username=self.user_object.username)
        self.token = generate_token(user)


    @classmethod
    def tearDown(self):
        Folder.objects.all().delete()
        FolderImage.objects.all().delete()
        User.objects.all().delete()

    def test_get_folders_and_media_1_child(self):

        response = self.client.get(
            self.me_url, {'parent': self.folder_1.id}, ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)['results']
        self.assertEqual(len(data), 1)

    def test_get_folders_and_media_full(self):

        response = self.client.get(
            self.me_url, {'parent': self.folder_2.id}, ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data['results']), 16)
        self.assertIsNotNone(data['links']['next'])
    
    def test_get_folders_and_media_no_creds(self):

        response = self.client.get(
            self.me_url, {'parent': self.folder_2.id})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
