from factory import django, LazyAttribute
from django.core.files.base import ContentFile
from factory import SubFactory

from recipe.test.factory import RecipeFactory
from image.models import RecipeImage

class RecipeImageFactory(django.DjangoModelFactory):
    class Meta:
        model = RecipeImage

    image = LazyAttribute(
        lambda _: ContentFile(
            django.ImageField()._make_data(
                {'width': 1024, 'height': 768}
            ), 'example.jpg'
        )
    )
    type = 'GALLERY'
    recipe = SubFactory(RecipeFactory)
