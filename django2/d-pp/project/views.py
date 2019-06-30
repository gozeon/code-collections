from django.shortcuts import render
from django.http import HttpResponse
from .models import One,Two, People, Card, Publication, Book

# Create your views here.


def index(request):
    o1 = One.objects.create(oname='hhaa', oage=11,odate='2017-12-15')
    o2 = One.objects.create(oname='哈哈', oage=11,odate='2017-12-15')

    t1 = Two.objects.create(tsub=o1, tfond='zheshigesh',tdes='这是个描述')
    t2 = Two.objects.create(tsub_id=o2.pk, tfond='这不导致是啥',tdes='这是个描述')
    return HttpResponse("one to one")


def about(request):
    p1 = People.objects.create(name="小王", card_num=4)
    p2 = People.objects.create(name="laowang" ,card_num=40)

    c1 = Card.objects.create(number='101', source="中国银行", person=p1)
    c2 = Card(number='121', source="中国那匹马和行", person=p1)
    c3 = Card(number='131', source="中国银行", person=p1)
    # c1.save()
    c2.save()
    c3.save()

    c4 = Card(number='2011', source="卖发一卡通", person=p2)
    c5 = Card(number='2201', source="一卡通卡通", person=p2)
    c6 = Card(number='2021', source="一张开", person=p2)
    c7 = Card(number='20121', source="移动一卡通", person=p2)
    c8 = Card(number='2301', source="联通卡通", person=p2)
    c4.save()
    c5.save()
    c6.save()
    c7.save()
    c8.save()

    return HttpResponse("one to many")

def document(request):
    p1 = Publication(pname='护板设', paddress='天津')
    p2 = Publication(pname='清华出版时护板设', paddress='北京')
    p3 = Publication(pname='出版时护板设', paddress='和别')

    p1.save()
    p2.save()
    p3.save()

    b1 = Book(bname="这是一本书",bauthor="找死")
    b2 = Book(bname="输",bauthor="刘恩死")
    b3 = Book(bname="在人间是一本书",bauthor="刘恩")
    b4 = Book(bname="我的大学本书",bauthor="这是个作者")

    b1.save()
    b2.save()
    b3.save()
    b4.save()

    b1.publication.add(p1,p2,p3)
    b2.publication.add(p1,p2)
    b3.publication.add(p1,p3)
    b4.publication.add(p2,p3)

    return HttpResponse('many to many')