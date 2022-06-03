from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.hashers import make_password

from user.models import User
import environ


class CreateSuperUser(BaseCommand):
    help = 'creates superuser'
   

    def handle(self,*args,**options):
        env = environ.Env()
        environ.Env.read_env()
        user = User(
                username=env('DJANGO_SUPERUSER_USERNAME'),
                password=make_password(env('DJANGO_SUPERUSER_PASSWORD')),
                email=env('DJANGO_SUPERUSER_EMAIL'),
                is_active=True,
                is_staff=True
            )
        user.save()
        self.stdout.write(self.style.SUCCESS('Succefuly created superuser'))
