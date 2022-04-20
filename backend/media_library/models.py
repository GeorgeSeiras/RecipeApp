import json
import os
import uuid
from django.db import models
from django.db.models.deletion import CASCADE
from django.dispatch import receiver


def get_file_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s.%s" % (uuid.uuid4(), ext)
    return filename


class Folder(models.Model):
    user = models.ForeignKey('user.user', on_delete=CASCADE)
    parent = models.ForeignKey(
        'self', on_delete=CASCADE, null=True)
    name = models.TextField(max_length=25)
    depth = models.IntegerField()

    def to_dict(self):
        dict = {}
        dict['id'] = self.id
        if self.parent != None:
            dict['parent'] = self.parent.to_dict()
        else:
            dict['parent'] = None
        dict['user'] = self.user.to_dict()
        dict['name'] = self.name
        dict['depth'] = self.depth
        dict['type'] = 'folder'
        return dict

    def to_list(folders):
        list = []
        for folder in folders:
            list.append(folder.to_dict())
        return list

    def folders_to_list_sorted(folders):
        folder_list = Folder.to_list(folders)
        folder_dict = {}
        folders_to_delete = []
        for folder in folder_list:
            folder['children'] = []
            folder_dict[folder['id']] = folder
        for folder in folder_list:
            if(folder['parent'] != None):
                parent = folder_dict[folder['parent'].id]
                parent['children'].append(folder)
                folder['parent'] = folder['parent'].id
                folders_to_delete.append(folder['id'])
        for id in folders_to_delete:
            del folder_dict[id]
        return json.loads(json.dumps(list(folder_dict.values())))


class FolderImage(models.Model):
    folder = models.ForeignKey(Folder, on_delete=CASCADE)
    image = models.ImageField(upload_to=get_file_path)
    name = models.TextField(max_length=25)

    def to_dict(self):
        dict = {}
        dict['id'] = self.id
        dict['folder'] = self.folder.to_dict()
        dict['name'] = self.name
        dict['image'] = str(self.image)
        dict['type'] = 'image'
        return dict

    def to_list(media):
        list = []
        for item in media:
            list.append(item.to_dict())
        return list


@receiver(models.signals.post_delete, sender=FolderImage)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `Recipe` object is deleted.
    """
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)
