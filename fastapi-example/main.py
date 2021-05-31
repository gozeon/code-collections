from fastapi import FastAPI

app = FastAPI()


@app.get('/')
def index():
    return {'data': 'blog list'}


@app.get('/blog/ttt')
def show():
    return {'path ttt'}


@app.get('/blog/{id}')
def show(id: int):
    return {'id': id}


@app.get('/blog/{id}/commons')
def commons(id: int, limit=10):
    return {'data': {"1", "2"}, 'limit': limit}
