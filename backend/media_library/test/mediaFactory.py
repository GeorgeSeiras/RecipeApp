from factory import django, SubFactory,LazyAttribute
from factory.django import DjangoModelFactory
from faker import Faker as FakerClass

from media_library.models import Folder,FolderImage
from user.test.factory import UserFactory
from django.core.files.base import ContentFile

fake=FakerClass()

class FolderFactory(DjangoModelFactory):
    class Meta:
        model = Folder

    user = SubFactory(UserFactory)
    name = LazyAttribute(lambda n: fake.word()[:25])

class FolderImageFactory(DjangoModelFactory):
    class Meta:
        model = FolderImage
    
    folder = SubFactory(FolderFactory)
    name = LazyAttribute(lambda n: fake.word()[:25])
    image = LazyAttribute(
        lambda _: ContentFile(
            django.ImageField()._make_data(
                {'width': 1024, 'height': 768}
            ), 'example.jpg'
        )
    )