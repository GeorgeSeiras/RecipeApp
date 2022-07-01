from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from user.models import User
import environ


class Command(BaseCommand):
    help = 'creates superuser'
   

    def handle(self,*args,**options):
        env = environ.Env()
        environ.Env.read_env()
        superuser = User.objects.filter(is_superuser=True)
        if(len(superuser) > 0):
            return
        try:
            user = User.objects.get(Q(username=env('DJANGO_SUPERUSER_USERNAME'))|Q(email=env('DJANGO_SUPERUSER_EMAIL') ))
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
