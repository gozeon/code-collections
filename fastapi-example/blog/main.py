from fastapi import FastAPI, Depends, Response, status, HTTPException
from . import schemas, models, database, hashing
from sqlalchemy.orm import Session
from .routers import blog
app = FastAPI()

models.Base.metadata.create_all(database.engine)

app.include_router(blog.router)
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/blog", status_code=status.HTTP_201_CREATED, tags=['blog'])
def create_blog(request: schemas.Blog, db: Session = Depends(get_db)):
    new_blog = models.Blog(title=request.title, body=request.body, user_id=1)
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    return new_blog


@app.delete("/blog/{id}", status_code=status.HTTP_204_NO_CONTENT, tags=['blog'])
def destory(id, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id == id)
    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog with the {id} is not available")
    blog.delete(synchronize_session=False)
    db.commit()
    return 'delete'


@app.put("/blog/{id}", status_code=status.HTTP_202_ACCEPTED, tags=['blog'])
def update(id, request: schemas.Blog, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id == id)
    if not blog.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog with the {id} is not available")
    blog.update(request.dict())
    db.commit()
    return 'update'


# @app.get("/blog", tags=['blog'])
# def all(db: Session = Depends(get_db)):
#     blogs = db.query(models.Blog).all()
#     return blogs


@app.get("/blog/{id}", status_code=status.HTTP_200_OK, tags=['blog'])
def detail(id: int, response: Response, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).where(models.Blog.id == id).first()
    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog with the {id} is not available")
        # response.status_code =status.HTTP_404_NOT_FOUND
        # return {"detail": f"Blog with the {id} is not available"}
    return blog


@app.post("/user", response_model=schemas.ShowUser, tags=['user'])
def create_user(request: schemas.User, db: Session = Depends(get_db)):
    new_user = models.User(name=request.name, email=request.email, password=hashing.Hash().bcrypt(request.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
