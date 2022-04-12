import os
import uuid
from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.fields.related import ForeignKey
from django.dispatch.dispatcher import receiver
from django.utils.translation import gettext_lazy as _


def get_file_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s.%s" % (uuid.uuid4(), ext)
    return filename


class RecipeImageType(models.TextChoices):
    THUMBNAIL = 'THUMBNAIL', _('THUMBNAIL'),
    GALLERY = 'GALLERY', _('GALLERY')


class RecipeImage(models.Model):
    image = models.ImageField(
        upload_to=get_file_path
    )
    type = models.CharField(choices=RecipeImageType.choices, max_length=10)
    recipe = ForeignKey('recipe.recipe', on_delete=CASCADE)

    def to_dict(self):
        dict = {}
        dict['id'] = self.id
        dict['type'] = self.type
        dict['recipe'] = self.recipe.id
        dict['image'] = str(self.image)
        return dict

    def recipe_images_to_list(images):
        list = []
        for image in images:
            list.append(image.to_dict())
        return list

@receiver(models.signals.post_delete, sender=RecipeImage)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `Recipe` object is deleted.
    """
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)