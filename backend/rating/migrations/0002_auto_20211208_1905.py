# Generated by Django 3.2.9 on 2021-12-08 17:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('recipe', '0004_alter_recipe_steps'),
        ('rating', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='rating',
            name='recipe',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='recipe.recipe'),
        ),
        migrations.AddField(
            model_name='rating',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='rating',
            unique_together={('user', 'recipe')},
        ),
        migrations.RemoveField(
            model_name='rating',
            name='recipe',
        ),
        migrations.RemoveField(
            model_name='rating',
            name='user',
        ),
    ]
