# Generated by Django 3.2.9 on 2021-12-02 15:36

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('recipe', '0001_initial'),
        ('rating', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='rating',
            name='recipe',
            field=models.ManyToManyField(to='recipe.Recipe'),
        ),
    ]
