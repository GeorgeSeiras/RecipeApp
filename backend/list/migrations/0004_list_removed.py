# Generated by Django 3.2.9 on 2022-04-27 12:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('list', '0003_list_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='list',
            name='removed',
            field=models.BooleanField(default=False),
        ),
    ]
