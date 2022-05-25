from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from user.test.utils import generate_token

from recipe.models import Recipe
from recipe.test.factory import RecipeFactory
from .factory_recipe import RecipeImageFactory
from user.models import User
from image.models import RecipeImage


class RecipeImageTest(APITestCase):

    @classmethod
    def setUp(self):
        self.recipe = RecipeFactory.create()
        self.recipe_2 = RecipeFactory.create()
        self.client = APIClient()
        self.create_recipe_image_url = reverse(
            'images-recipe', kwargs={'recipe_id': self.recipe.id})
        self.create_recipe_image_url_2 = reverse(
            'images-recipe', kwargs={'recipe_id': self.recipe_2.id})
        user = User.objects.get(username=self.recipe.user.username)
        self.token = generate_token(user)
    
    @classmethod
    def tearDown(self):
        User.objects.all().delete()
        Recipe.objects.all().delete()
        RecipeImage.objects.all().delete()
     
    def test_delete_recipe_images(self):
        recipe_images = []
        for i in range(0, 3):
            recipe_images.append(RecipeImageFactory(recipe=self.recipe))
        payload = {'images': [recipe_images[0].id, recipe_images[2].id]}
        response = self.client.delete(
            self.create_recipe_image_url, json.dumps(payload), content_type='application/json', **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        images = RecipeImage.objects.filter(id__in=[recipe_images[0].id,recipe_images[1].id,recipe_images[2].id]).values()
        self.assertEqual(len(images),1)
        self.assertEqual(images[0]['id'],recipe_images[1].id)