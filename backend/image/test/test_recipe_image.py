from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from user.test.utils import generate_token

from recipe.models import Recipe
from recipe.test.factory import RecipeFactory
from user.models import User
from image.models import RecipeImage


class RecipeImageTest(APITestCase):

    @classmethod
    def setUp(self):
        self.recipe = RecipeFactory.create()
        self.recipe_2 = RecipeFactory.create()
        self.client = APIClient()
        self.create_recipe_image_url = reverse(
            'image-recipe', kwargs={'recipe_id': self.recipe.id})
        self.create_recipe_image_url_2 = reverse(
            'image-recipe', kwargs={'recipe_id': self.recipe_2.id})
        user = User.objects.get(username=self.recipe.user.username)
        self.token = generate_token(user)
        self.images = []
        for i in range(0, 5):
            image = (
                b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
                b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
                b'\x02\x4c\x01\x00\x3b'
            )
            self.images.append(SimpleUploadedFile(
                'small.gif', image, content_type='image/gif'))

    @classmethod
    def tearDown(self):
        User.objects.all().delete()
        Recipe.objects.all().delete()
        RecipeImage.objects.all().delete()
     
    def test_create_recipe_thumbnail(self):
        payload = {'images[0].image': self.images[0],
                   'images[0].type': 'THUMBNAIL'}
        response = self.client.put(
            self.create_recipe_image_url, payload, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        thumbnail = json.loads(response.content)['result']
        self.assertEqual(len(thumbnail), 1)
        image_created = RecipeImage.objects.filter(id__in=[thumbnail[0]['id']])
        self.assertEqual(len(image_created), 1)
        self.assertEqual(thumbnail[0]['image'], image_created[0].image)

    def test_create_recipe_gallery(self):
        payload = {'images[0].image': self.images[0],
                   'images[0].type': 'GALLERY',
                   'images[1].image': self.images[1],
                   'images[1].type': 'GALLERY'}
        response = self.client.put(
            self.create_recipe_image_url, payload, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        gallery = json.loads(response.content)['result']
        self.assertEqual(len(gallery), 2)
        image_created = RecipeImage.objects.filter(
            id__in=[gallery[0]['id'], gallery[1]['id']])
        self.assertEqual(len(image_created), 2)
        self.assertEqual(gallery[0]['image'], image_created[0].image)
        self.assertEqual(gallery[1]['image'], image_created[1].image)

    def test_create_recipe_images_no_credentials(self):
        response = self.client.put(self.create_recipe_image_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_recipe_images_wrong_payload(self):
        payload = {'images[0]': self.images[0],
                   'images[0]': 'GALLERY',
                   'images[1]': self.images[1],
                   'images[1]': 'GALLERY'}
        response = self.client.put(
            self.create_recipe_image_url, payload, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(json.loads(response.content)[
                         'message'], 'Image or type is missing')

    def test_create_recipe_images_missing_type(self):
        payload = {'images[0].image': self.images[0],
                   'images[0]': 'GALLERY'}
        response = self.client.put(
            self.create_recipe_image_url, payload, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(json.loads(response.content)[
                         'message'], 'Image or type is missing')

    def create_recipe_other_users_recipe(self):
        response = self.client.put(
            self.create_recipe_image_url_2, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
