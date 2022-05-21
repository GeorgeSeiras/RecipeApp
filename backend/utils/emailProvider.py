from backend.settings import EMAIL_HOST_USER
from django.core.mail import send_mail
from uuid import uuid4
import environ

from tokens.models import RegistrationToken
from user.models import User


# Initialise environment
env = environ.Env()
environ.Env.read_env()


def send_verification_email( user):
    user_object = User.objects.get(user['id'])
    url = env('FRONTEND_URL')
    token = RegistrationToken(user=user_object, uuid=uuid4())
    subject = 'Verify your email'
    message = 'Please verify your email by clicking the following link: '+url+'/user/confirmation?'+token.uuid
    recepient = user['email']
    print(message)
    send_mail(subject, message, EMAIL_HOST_USER,
              [recepient], fail_silently=False)
