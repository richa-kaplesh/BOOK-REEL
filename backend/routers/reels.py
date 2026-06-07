from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.reel import Reel
from models.user import User
from schemas.reel import ReelResponse
from schemas.like import LikeResponse
from services.feed import get_reels_by_book
from services.like import like_reel, unlike_reel
from services.auth import get_current_user

router = APIRouter(prefix="/reels", tags=["Reels"])


@router.get("/book/{book_id}", response_model=list[ReelResponse])
def get_book_reels(
    book_id: str,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    return get_reels_by_book(db, book_id, skip, limit)


@router.get("/{reel_id}", response_model=ReelResponse)
def get_reel(reel_id: str, db: Session = Depends(get_db)):
    reel = db.query(Reel).filter(Reel.id == reel_id).first()
    if not reel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reel not found")
    return reel


@router.post("/{reel_id}/like", response_model=LikeResponse, status_code=201)
def like(
    reel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return like_reel(db, current_user.id, reel_id)


@router.delete("/{reel_id}/like", status_code=204)
def unlike(
    reel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    unlike_reel(db, current_user.id, reel_id)