from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.hashers import make_password

from user.models import User
import environ


class Command(BaseCommand):
    help = 'creates superuser'
   

    def handle(self,*args,**options):
        env = environ.Env()
        environ.Env.read_env()
        try:
            user = User.objects.get(username=env('DJANGO_SUPERUSER_USERNAME'))
        except User.DoesNotExist:
            User.objects.create(
                    username=env('DJANGO_SUPERUSER_USERNAME'),
                    password=make_password(env('DJANGO_SUPERUSER_PASSWORD')),
                    email=env('DJANGO_SUPERUSER_EMAIL'),
                    is_active=True,
                    is_staff=True,
                    is_superuser=True
                )
            self.stdout.write(self.style.SUCCESS('Succefuly created superuser'))
