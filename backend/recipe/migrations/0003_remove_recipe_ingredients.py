# Generated by Django 3.2.9 on 2021-12-02 16:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recipe', '0002_recipe_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='recipe',
            name='ingredients',
        ),
    ]
