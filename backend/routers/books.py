from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.reel import Reel
from schemas.book import BookCreate, BookResponse
from schemas.reel import ReelResponse
from services.book import create_book, create_book_from_title, get_book_by_id, get_all_books, search_books, delete_book
from services.extractor import extract_reels
from services.auth import get_current_user

router = APIRouter(prefix="/books", tags=["Books"])


@router.get("/", response_model=list[BookResponse])
def list_books(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return get_all_books(db, skip, limit)


@router.get("/search", response_model=list[BookResponse])
def search(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    return search_books(db, q)


@router.get("/{book_id}", response_model=BookResponse)
def get_book(book_id: str, db: Session = Depends(get_db)):
    return get_book_by_id(db, book_id)


@router.post("/", response_model=BookResponse, status_code=201)
def add_book(
    payload: BookCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_book(db, payload)


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

@router.delete("/{book_id}", status_code=204)
def remove_book(
    book_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    delete_book(db, book_id)