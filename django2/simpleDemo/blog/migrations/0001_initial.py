# Generated by Django 2.1.5 on 2019-01-14 15:14

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('comment', models.TextField()),
                ('create_at', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
    ]
