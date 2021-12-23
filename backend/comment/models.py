from django.db import models
from django.db.models.deletion import CASCADE
from django.dispatch.dispatcher import receiver


from utils.custom_exceptions import CustomException


class Comment(models.Model):
    recipe = models.ForeignKey('recipe.recipe', on_delete=CASCADE)
    user = models.ForeignKey('user.user', on_delete=CASCADE)
    text = models.CharField(max_length=250)
    parent = models.ForeignKey(
        'self', on_delete=CASCADE, null=True)
    deleted = models.BooleanField(default=False)

    def get_parent(self):
        
        try:
            parent = Comment.objects.get(pk=self.parent.id)
        except Comment.DoesNotExist:
            raise CustomException(
                'There was an error retriving the parent comment', 500)
        return parent.to_dict()

    def to_dict(self):
        dict = {}
        dict['id'] = self.id
        dict['user'] = self.user.to_dict()
        dict['recipe'] = self.recipe.id
        dict['text'] = self.text
        dict['deleted'] = self.deleted
        if self.parent != None:
            dict['parent'] = self.get_parent()
        else:
            dict['parent'] = None
        return dict

'''
    instance.deleted == True means that either
    a moderator or the user deleted the comment
'''

@receiver(models.signals.pre_save, sender=Comment)
def comment_pre_save(sender, instance, **kwargs):
    if instance.deleted == True and instance.text != "[deleted]":
        instance.text = "[deleted]"
        instance.save()