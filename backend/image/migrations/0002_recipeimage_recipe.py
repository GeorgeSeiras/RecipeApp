# Generated by Django 3.2.9 on 2022-01-08 17:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('recipe', '0001_initial'),
        ('image', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipeimage',
            name='recipe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='recipe.recipe'),
        ),
    ]
