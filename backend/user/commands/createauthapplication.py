from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.hashers import make_password

from oauth2_provider.models import Application
from user.models import User


class CreateApplication(BaseCommand):
    help = 'creates aplication for authentication'
   

    def handle(self,*args,**options):
        try:
            user = User.objects.get(username='admin')
        except User.DoesNotExist:
            raise CommandError('User not found')
        application = Application(
                user=user,
                client_type='Confidational',
                grant_type='Resource owner password-based'
            )
        application.save()
        self.stdout.write(self.style.SUCCESS('Succefuly created application'))
