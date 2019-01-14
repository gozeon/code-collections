from django.shortcuts import render, redirect

from .models import Comment
from .forms import CommentForm

def index(request):
    comments = Comment.objects.order_by('-create_at')
    context = {'comments': comments}

    return render(request, 'blog/index.html', context)

def sign(request):
    if request.method == 'POST':
        form = CommentForm(request.POST)

        if form.is_valid():
            new_comment = Comment(name = request.POST['name'],
                                  comment=request.POST['comment'])
            new_comment.save()
            return redirect('index')
    else:
        form = CommentForm

    content = {'form': form}
    return render(request, 'blog/sign.html', content)