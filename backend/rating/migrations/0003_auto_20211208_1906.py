# Generated by Django 3.2.9 on 2021-12-08 17:06

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recipe', '0004_alter_recipe_steps'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('rating', '0002_auto_20211208_1905'),
    ]

    operations = [
        migrations.AddField(
            model_name='rating',
            name='recipe',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='recipe.recipe'),
        ),
        migrations.AddField(
            model_name='rating',
            name='user',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
