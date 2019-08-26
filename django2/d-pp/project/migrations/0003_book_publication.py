# Generated by Django 2.2.2 on 2019-06-30 13:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0002_card_people'),
    ]

    operations = [
        migrations.CreateModel(
            name='Publication',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pname', models.CharField(max_length=200)),
                ('paddress', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bname', models.CharField(max_length=200)),
                ('bauthor', models.ManyToManyField(to='project.Publication')),
            ],
        ),
    ]