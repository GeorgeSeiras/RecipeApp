# Generated by Django 3.2.9 on 2022-04-27 12:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_alter_user_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='removed',
            field=models.BooleanField(default=False),
        ),
    ]
