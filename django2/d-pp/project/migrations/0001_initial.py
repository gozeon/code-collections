# Generated by Django 2.2.2 on 2019-06-30 13:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='One',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('oname', models.CharField(max_length=20, null=True)),
                ('oage', models.CharField(max_length=20, null=True)),
                ('odate', models.DateField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Two',
            fields=[
                ('tsub', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='project.One')),
                ('tfond', models.CharField(max_length=20, null=True)),
                ('tdes', models.CharField(max_length=200, null=True)),
            ],
        ),
    ]