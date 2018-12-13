from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def hello(request):
    return HttpResponse("Hello world")


def date(request, year, month, day):
    return HttpResponse({
        year: year,
        month: month,
        day: day
    })
