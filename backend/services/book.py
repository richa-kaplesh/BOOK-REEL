from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.book import Book
from schemas.book import BookCreate


def create_book(db: Session, data: BookCreate) -> Book:
    existing = db.query(Book).filter(
        Book.title == data.title,
        Book.author == data.author
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Book already exists")

    book = Book(
        title=data.title,
        author=data.author,
        genre=data.genre,
        cover_image_url=data.cover_image_url,
        source_url=data.source_url
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


def get_book_by_id(db: Session, book_id: int) -> Book:
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    return book


def get_all_books(db: Session, skip: int = 0, limit: int = 20) -> list[Book]:
    return db.query(Book).offset(skip).limit(limit).all()


def search_books(db: Session, query: str) -> list[Book]:
    return db.query(Book).filter(
        Book.title.ilike(f"%{query}%") |
        Book.author.ilike(f"%{query}%") |
        Book.genre.ilike(f"%{query}%")
    ).all()


def delete_book(db: Session, book_id: int) -> None:
    book = get_book_by_id(db, book_id)
    db.delete(book)
    db.commit()