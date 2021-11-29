# Generated by Django 3.2.9 on 2021-11-29 17:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recipe', '0002_auto_20211129_1907'),
    ]

    operations = [
        migrations.CreateModel(
            name='Step',
            fields=[
                ('id', models.BigIntegerField(db_column='step_id', primary_key=True, serialize=False)),
                ('step_num', models.IntegerField()),
                ('desc', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'step',
            },
        ),
        migrations.AlterField(
            model_name='recipe',
            name='ingredients',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.DO_NOTHING, to='recipe.ingredient'),
        ),
        migrations.AddField(
            model_name='recipe',
            name='steps',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.DO_NOTHING, to='recipe.step'),
        ),
    ]
