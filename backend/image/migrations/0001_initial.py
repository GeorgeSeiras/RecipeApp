# Generated by Django 3.2.9 on 2022-05-19 13:49

from django.db import migrations, models
import image.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RecipeImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=image.models.get_file_path)),
                ('type', models.CharField(choices=[('THUMBNAIL', 'THUMBNAIL'), ('GALLERY', 'GALLERY')], max_length=10)),
            ],
        ),
    ]
