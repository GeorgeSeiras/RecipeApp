from django.db import models
import uuid

from user.models import User


class RegistrationToken(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    expired = models.BooleanField(default=False)
    created_at = models.DateTimeField(
        auto_now_add=True
    )
