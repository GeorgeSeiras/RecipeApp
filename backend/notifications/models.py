from random import choices
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from user.models import User
from comment.models import Comment


class Type(models.TextChoices):
    REPLY = 'REPLY', _('REPLY'),
    COMMENT = 'COMMENT', _('COMMENT'),


class Notifications(models.Model):
    user_sender = models.ForeignKey(
        User, null=True, related_name='user_sender', on_delete=models.CASCADE)
    user_receiver = models.ForeignKey(
        User, null=True, related_name='user_receiver', on_delete=models.CASCADE)
    type = models.CharField(choices=Type.choices, max_length=10)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def to_dict(self):
        dict = {}
        dict['sender'] = self.user_sender.to_dict()
        dict['receiver'] = self.user_receiver.to_dict()
        dict['type'] = self.type
        dict['read'] = self.read
        return dict

    def to_list(notifications):
        list = []
        for item in notifications:
            list.append(item.to_dict())
        return list


@receiver(post_save, sender=Notifications)
def create_notification(sender, instance, created, **kwargs):
    if created:
        layer = get_channel_layer()
        async_to_sync(layer.group_send)(
            f"user_{instance.user_receiver.username}",
            {"type": "send_notification", "content": instance.to_dict()}
        )
