# Generated by Django 3.2.9 on 2022-04-17 16:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('media_library', '0003_folder_depth'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='folderimage',
            name='user',
        ),
    ]
