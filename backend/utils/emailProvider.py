from backend.settings import EMAIL_HOST_USER
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from rest_framework.exceptions import NotFound
from uuid import uuid4
import environ

from tokens.models import RegistrationToken
from user.models import User

# Initialise environment
env = environ.Env()
environ.Env.read_env()


def send_verification_email(id, email):
    try:
        user_object = User.objects.get(pk=id)
    except User.DoesNotExist:
        raise NotFound('User not found')
    url = env('FRONTEND_URL')
    token = RegistrationToken(user=user_object, uuid=uuid4())
    token.save()
    subject = 'Verify your email'
    message = 'Please verify your email by clicking the following link: <a> href={}/user/confirmation?token={}</a>'.format(
        url, token.uuid)
    merge_data = {'url': url, 'token': token.uuid}
    html_body = render_to_string('./email.html',merge_data)
    recepient = email
    mail = EmailMultiAlternatives(subject=subject,
                                  body=message,
                                  from_email=EMAIL_HOST_USER,
                                  to=[recepient]
                                  )
    mail.attach_alternative(html_body,'text/html')
    mail.send()
