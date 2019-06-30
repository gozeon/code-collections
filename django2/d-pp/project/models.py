from django.db import models

# Create your models here.


class One(models.Model):
    oname = models.CharField(max_length=20, null=True)
    oage = models.CharField(max_length=20, null=True)
    odate = models.DateField(null=True)


class Two(models.Model):
    tsub = models.OneToOneField(One, on_delete=models.CASCADE, primary_key=True)
    tfond = models.CharField(max_length=20, null=True)
    tdes = models.CharField(max_length=200, null=True)


class People(models.Model):
    name = models.CharField(max_length=50)
    card_num = models.IntegerField(default=0)


class Card(models.Model):
    number = models.CharField(max_length=20)
    person = models.ForeignKey(People, on_delete=models.CASCADE, help_text='名字')
    source = models.CharField(max_length=50)


class Publication(models.Model):
    pname = models.CharField(max_length=200)
    paddress = models.CharField(max_length=200)


class Book(models.Model):
    bname = models.CharField(max_length=200)
    bauthor = models.CharField(max_length=200)
    publication = models.ManyToManyField(Publication)
