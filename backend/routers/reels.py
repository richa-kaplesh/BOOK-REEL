from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.reel import Reel
from models.book import Book
from schemas.reel import ReelResponse
from services.extractor import extract_reels
from services.feed import get_reels_by_book
from services.auth import get_current_user

router = APIRouter(prefix="/reels", tags=["Reels"])

@router.post("/from-title", response_model=BookWithReelsResponse, status_code=201)
async def add_book_from_title(
    title: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    book = await create_book_from_title(db, title)
    raw_reels = await extract_reels(book.title, book.author)

    reels = []
    for r in raw_reels:
        reel = Reel(
            book_id=book.id,
            type=r["type"],
            content=r["content"],
            order_index=r["order_index"]
        )
        db.add(reel)
        reels.append(reel)

    db.commit()
    for reel in reels:
        db.refresh(reel)

    return {"book": book, "reels": reels}