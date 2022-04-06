from factory import django, LazyAttribute
from django.core.files.base import ContentFile

from image.models import  UserImage


class UserImageFactory(django.DjangoModelFactory):
    class Meta:
        model = UserImage

    image = LazyAttribute(
        lambda _: ContentFile(
            django.ImageField()._make_data(
                {'width': 1024, 'height': 768}
            ), 'example.jpg'
        )
    )
