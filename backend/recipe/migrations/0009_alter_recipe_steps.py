# Generated by Django 3.2.9 on 2022-04-06 17:44

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipe', '0008_alter_recipe_steps'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='steps',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=400), size=None),
        ),
    ]
