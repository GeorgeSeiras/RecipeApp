from oauth2_provider.models import Application, AccessToken
from oauthlib import common
from datetime import timedelta
from django.utils import timezone

def generate_token(user):
    application = Application.objects.create(name="RecipeApp", client_type="Public",
                                                 authorization_grant_type="Resource owner password-based", user_id=user.id)
    access_token = AccessToken(token=common.generate_token(),user= user,application= application,expires=(timezone.now() + timedelta(days=1)))
    access_token.save()
    return access_token.token