from django.dispatch import receiver
from django.urls import reverse
from backend.settings import EMAIL_HOST_USER
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from rest_framework.exceptions import NotFound
from uuid import uuid4
import environ
from django_rest_passwordreset.signals import reset_password_token_created

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
    message = 'Please verify your email by clicking the following link: href=https://{}/user/confirmation?token={}'.format(
        url, token.uuid)
    merge_data={'url':url,'token':token.uuid}
    html_body = render_to_string('email.html',merge_data)
    recepient = email
    mail = EmailMultiAlternatives(subject=subject,
                                  body=message,
                                  from_email=EMAIL_HOST_USER,
                                  to=[recepient]
                                  )
    mail.attach_alternative(html_body,"text/html")
    mail.send(fail_silently=False)


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """

    url = env('FRONTEND_URL')
    subject = 'Reset your password'
    message = 'Click here to reset your password: href=https://{}/password/reset/{}'.format(
        url, reset_password_token.key)
    merge_data={'url':url,'token':reset_password_token.key}
    html_body = render_to_string('password_reset.html',merge_data)
    mail = EmailMultiAlternatives(subject=subject,
                                  body=message,
                                  from_email=EMAIL_HOST_USER,
                                  to=[reset_password_token.user.email]
                                  )
    mail.attach_alternative(html_body,"text/html")
    mail.send(fail_silently=False)