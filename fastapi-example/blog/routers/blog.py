from typing import List
from fastapi import APIRouter, Depends
from .. import schemas, database, models
from sqlalchemy.orm import Session
router = APIRouter()


@router.get("/blog", response_model=List[schemas.ShowBlog] ,tags=['blog'])
def all(db: Session = Depends(database.get_db)):
    blogs = db.query(models.Blog).all()
    return blogs
