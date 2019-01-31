from django.views.generic import ListView, DetailView
from .models import Movie


class MovieList(ListView):
    paginate_by = 10
    model = Movie


class MovieDetail(DetailView):
    model = Movie
