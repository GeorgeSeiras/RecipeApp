from django.db import models
from django.db.models.deletion import CASCADE


from utils.custom_exceptions import CustomException


class Comment(models.Model):
    recipe = models.ForeignKey('recipe.recipe', on_delete=CASCADE)
    user = models.ForeignKey('user.user', on_delete=CASCADE)
    text = models.CharField(max_length=250)
    parent = models.ForeignKey(
        'self', on_delete=CASCADE, null=True)

    def get_parent(self):
        try:
            parent = Comment.objects.get(pk=self.id)
        except Comment.DoesNotExist:
            raise CustomException(
                'There was an error retriving the parent comment', 500)

    def to_dict(self):
        dict = {}
        dict['id'] = self.id
        dict['user'] = self.user.to_dict()
        dict['recipe'] = self.recipe.to_dict()
        dict['text'] = self.text
        if self.parent != None:
            dict['parent'] = self.get_parent()
        else:
            dict['parent'] = None
        return dict
