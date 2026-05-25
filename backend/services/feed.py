from sqlalchemy.orm import Session
from models.reel import Reel
from models.book import Book


def get_global_feed(db: Session, skip: int = 0, limit: int = 20) -> list[Reel]:
    return (
        db.query(Reel)
        .order_by(Reel.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_feed_by_genre(db: Session, genre: str, skip: int = 0, limit: int = 20) -> list[Reel]:
    return (
        db.query(Reel)
        .join(Book, Reel.book_id == Book.id)
        .filter(Book.genre.ilike(f"%{genre}%"))
        .order_by(Reel.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_reels_by_book(db: Session, book_id, skip: int = 0, limit: int = 20) -> list[Reel]:
    return (
        db.query(Reel)
        .filter(Reel.book_id == book_id)
        .order_by(Reel.order_index.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )