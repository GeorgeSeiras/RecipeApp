from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from factory.fuzzy import FuzzyText
from user.test.utils import generate_token
from user.test.factory import UserFactory
from django.core.files.uploadedfile import SimpleUploadedFile

from media_library.models import Folder, FolderImage
from media_library.test.mediaFactory import FolderFactory
from user.models import User


class FolderCreateTest(APITestCase):

    @classmethod
    def setUp(self):
        self.password = FuzzyText('password').fuzz()
        self.user_object = UserFactory.create(
            password_unecrypted=self.password)
        self.client = APIClient()
        self.folder = FolderFactory.create(depth=0, user=self.user_object)
        self.url = reverse('create-media')
        user = User.objects.get(username=self.user_object.username)
        self.token = generate_token(user)


    @classmethod
    def tearDown(self):
        Folder.objects.all().delete()
        FolderImage.objects.all().delete()
        User.objects.all().delete()

    def test_media_create(self):
        image = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
            b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
            b'\x02\x4c\x01\x00\x3b'
        )
        uploaded = SimpleUploadedFile(
            'small.gif', image, content_type='image/gif')
        payload = {
            'name': 'name',
            'image': uploaded,
            'folder': self.folder.id
        }
        response = self.client.post(
            self.url, payload,  ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = json.loads(response.content)['result']
        folder = FolderImage.objects.get(pk=data['id'])
        self.assertEqual(folder.name, 'name')
        self.assertIsNotNone(folder.image)

    def test_media_create_no_creds(self):
        image = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
            b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
            b'\x02\x4c\x01\x00\x3b'
        )
        uploaded = SimpleUploadedFile(
            'small.gif', image, content_type='image/gif')
        payload = {
            'name': 'name',
            'image': uploaded,
            'folder': self.folder.id
        }
        response = self.client.post(
            self.url, payload)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_media_missing_fields(self):

        response = self.client.post(
            self.url,  ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = json.loads(response.content)
        self.assertEqual(data['folder'],['This field is required.'])
        self.assertEqual(data['image'],['No file was submitted.'])
        self.assertEqual(data['name'],['This field is required.'])
