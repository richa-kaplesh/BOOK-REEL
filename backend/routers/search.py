from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models.reel import Reel
from models.book import Book
from schemas.reel import ReelResponse

router = APIRouter(prefix="/search", tags =["Search"])

@router.get("/", response_model=list[ReelResponse])
def search_reels(
    q: str = Query(..., min_length=1),
    skip: int =0,
    limit : int = 20,
    db: Session = Depends(get_db)
):
    return(
        db.query(Reel)
        .join(Book, Reel.book_id == Book.id)
        .filter(
            Book.title.ilike(f"%{q}%") |
            Book.author.ilike(f"%{q}%") 
        )

        .order_by(Reel.order_index.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )

   