# Generated by Django 3.2.9 on 2022-04-17 14:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('media_library', '0002_folderimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='folder',
            name='depth',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
