# Generated by Django 2.2.2 on 2019-06-30 13:54

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0003_book_publication'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='publication',
            field=models.ManyToManyField(to='project.Publication'),
        ),
        migrations.RemoveField(
            model_name='book',
            name='bauthor',
        ),
        migrations.AddField(
            model_name='book',
            name='bauthor',
            field=models.CharField(default=django.utils.timezone.now, max_length=200),
            preserve_default=False,
        ),
    ]