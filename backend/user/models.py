import os
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import CASCADE
from django.dispatch.dispatcher import receiver
from django.utils.translation import ugettext_lazy as _


def get_file_path(instance, filename):
    if(len(filename.split('.')) == 1):
        filename = '%s.%s' % (uuid.uuid4(),'jpg')
    else:
        ext = filename.split('.')[-1]
        filename = "%s.%s" % (uuid.uuid4(), ext)
    print(filename)
    return filename


class User(AbstractUser):
    username = models.CharField(
        max_length=100,
        unique=True,
    )
    email = models.EmailField(_('email address'), unique=True)
    image = models.ImageField(
        upload_to=get_file_path,
        null=True
    )
    removed = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    first_name = None
    last_name = None

    def __str__(self):
        return "{}".format(self.username)

    def to_dict(self):
        dict = {}
        dict['id'] = self.pk
        dict['username'] = self.username
        dict['email'] = self.email
        dict['is_staff'] = self.is_staff
        dict['is_active'] = self.is_active
        dict['removed'] = self.removed
        if(self.image != None):
            dict['image'] = str(self.image)
        return dict

    def users_to_list(users):
        user_list = []
        for user in users:
            user_list.append(user.to_dict())
        return user_list


@receiver(models.signals.pre_save, sender=User)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    Deletes old file from filesystem
    when corresponding `MediaFile` object is updated
    with new file.
    """
    # print(instance.to_dict())
    if not instance.pk:
        return False

    try:
        old_file = User.objects.get(pk=instance.pk).image
    except User.DoesNotExist:
        return False

    new_file = instance.image
    if not old_file == new_file:
        if(hasattr(old_file, 'image')):
            if os.path.isfile(old_file.image.path):
                os.remove(old_file.image.path)


@receiver(models.signals.post_delete, sender=User)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `Recipe` object is deleted.
    """
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)
