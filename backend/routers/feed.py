from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from schemas.reel import ReelResponse
from services.feed import get_global_feed, get_feed_by_genre

router = APIRouter(prefix="/feeds", tags=["Feeds"])


@router.get("/", response_model=list[ReelResponse])
def global_feed(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    return get_global_feed(db, skip, limit)


@router.get("/genre/{genre}", response_model=list[ReelResponse])
def genre_feed(
    genre: str,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    return get_feed_by_genre(db, genre, skip, limit)