import os
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import CASCADE
from django.dispatch.dispatcher import receiver
from django.utils.translation import ugettext_lazy as _

from image.models import UserImage


class User(AbstractUser):
    username = models.CharField(
        max_length=100,
        unique=True,
    )
    email = models.EmailField(_('email address'), unique=True)
    image = models.OneToOneField(UserImage, on_delete=CASCADE, null=True)

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
        if(self.image != None):
            dict['image'] = self.image.to_dict()
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
    if not instance.pk:
        return False

    try:
        old_file = User.objects.get(pk=instance.pk).image
    except User.DoesNotExist:
        return False

    new_file = instance.image
    if not old_file == new_file:
        if( hasattr(old_file,'image')):
            if os.path.isfile(old_file.image.path):
                os.remove(old_file.image.path)