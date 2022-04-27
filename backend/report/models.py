from django.db.models.deletion import CASCADE
from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models.deletion import CASCADE
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _


class Reason(models.TextChoices):
    OFFENSIVE_CONTENT = 'OFFENSIVE', _('OFFENSIVE_CONTENT'),
    UNRELATED_CONTENT = 'UNRELATED', _('UNRELATED_CONTENT'),
    OTHER = 'OTHER', _('OTHER')


class Status(models.TextChoices):
    PENDING = 'PENDING', _('PENDING'),
    CLOSED = 'CLOSED', _('CLOSED'),
    REMOVED = 'REMOVED', _('REMOVED')


class Type(models.TextChoices):
    RECIPE = 'RECIPE', _('RECIPE'),
    COMMENT = 'COMMENT', _('COMMENT'),
    LIST = 'LIST', _('LIST'),
    USER = 'USER', _('USER')


class Report(models.Model):
    user = models.ForeignKey('user.user', on_delete=CASCADE)
    reason = models.CharField(
        choices=Reason.choices, default=Reason.OFFENSIVE_CONTENT, max_length=20)
    desc = models.TextField(max_length=150)
    status = models.CharField(choices=Status.choices,
                              default=Status.PENDING, max_length=10)
    content_type = models.ForeignKey(
        ContentType, related_name='content_type_reports', on_delete=CASCADE)
    object_id = models.PositiveBigIntegerField()
    content_object = GenericForeignKey() 

    def to_dict(self):
        print(self.content_type)
        dict = {}
        dict['id'] = self.id
        dict['user'] = self.user.to_dict()
        dict['reason'] = self.reason
        dict['desc'] = self.desc
        dict['status'] = self.status
        dict['content_type'] = self.content_type
        dict['content_object'] = self.content_object
        dict['object_id'] = self.object_id
        return dict

@receiver(models.signals.pre_save, sender=Report)
def report_pre_save(sender, instance, **kwargs):
    content_object = instance.content_object
    if instance.status == Status.REMOVED:
        if(content_object.removed == False):
            content_object.removed = True
            content_object.save()
    else:
        content_object.removed = False
        content_object.save()
