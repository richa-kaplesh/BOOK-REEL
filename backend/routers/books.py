from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.models.reel import Reel
from backend.schemas.reel import ReelResponse
from backend.schemas.reel import ReelResponse
from backend.services.extractor import extract_reels
from backend.services.extractor import extract_reels
from backend.models.reel import Reel
from database import get_db
from models.user import User
from schemas.book import BookCreate, BookResponse
from services.book import create_book, create_book_from_title, get_book_by_id, get_all_books, search_books, delete_book
from services.auth import get_current_user

router = APIRouter(prefix="/books",tags =["Books"])

@router.post("/from-title", response_model=list[ReelResponse], status_code=201)
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

    return reels