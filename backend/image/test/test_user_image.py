from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from rest_framework_simplejwt.tokens import RefreshToken


from user.test.factory import UserFactory
from user.models import User


class RecipeCreateTest(APITestCase):

    @classmethod
    def setUp(self):
        self.user = UserFactory.create()
        self.client = APIClient()
        self.create_user_image_url = reverse('image-user')
        user = User.objects.get(username=self.user.username)
        refresh = RefreshToken.for_user(user)
        self.token = refresh.access_token

    def test_create_user_image(self):
        original_image = self.user.image.image
        image = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
            b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
            b'\x02\x4c\x01\x00\x3b'
        )
        uploaded = SimpleUploadedFile(
            'small.gif', image, content_type='image/gif')
        response = self.client.put(
            self.create_user_image_url, {'image': uploaded}, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)['result']
        self.assertNotEqual(data['image']['image'], original_image)

    def test_create_user_image_no_file(self):
        response = self.client.put(
            self.create_user_image_url, {'image': 'something'}, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(json.loads(response.content)['image'], [
                         "The submitted data was not a file. Check the encoding type on the form."])

    def test_create_user_image_no_credentials(self):
        response = self.client.put(self.create_user_image_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_user_image(self):
        response = self.client.delete(
            self.create_user_image_url, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = User.objects.get(username=self.user.username)
        self.assertEqual(user.image, None)

    def test_delete_user_image_no_credentials(self):
        response = self.client.delete(self.create_user_image_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)