# Generated by Django 3.2.9 on 2022-01-04 15:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recipe', '0004_alter_recipe_steps'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='recipe',
            name='photo',
        ),
    ]
