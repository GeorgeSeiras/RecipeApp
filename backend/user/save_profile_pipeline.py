import uuid
from django.core.files.temp import NamedTemporaryFile
from urllib.request import urlopen
from django.core.files import File

from user.models import User, get_file_path


def save_profile(backend, user, response, *args, **kwargs):
    if backend.name == 'facebook':
        url='https://graph.facebook.com/{0}/picture/?type=large&access_token={1}'.format(response['id'],response['access_token'])
        img_tmp = NamedTemporaryFile(delete=True)
        with urlopen(url) as uo:
            assert uo.status == 200
            img_tmp.write(uo.read())
            img_tmp.flush()
        img = File(img_tmp)
        user.image.save(img.name, img, True)
        user.save()
    elif backend.name == 'google-oauth2':
        url = response['picture']
        img_tmp = NamedTemporaryFile(delete=True)
        with urlopen(url) as uo:
            assert uo.status == 200
            img_tmp.write(uo.read())
            img_tmp.flush()
        img = File(img_tmp)
        user.image.save(img.name, img, True)
        user.save()
