from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from django.conf import settings

class User(AbstractUser):
    username = models.CharField(
        max_length = 100,
        unique = True,
    )
    email = models.EmailField(_('email address'), unique=True)
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
        
        return dict
    def users_to_list(users):
        user_list = []
        for user in users:
            user_list.append(user.to_dict())
        return user_list