from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.likes import Like
from schemas.like import LikeResponse


def like_reel(db: Session, user_id: int, reel_id: int) -> Like:
    existing = db.query(Like).filter(
        Like.user_id == user_id,
        Like.reel_id == reel_id
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already liked")

    like = Like(user_id=user_id, reel_id=reel_id)
    db.add(like)
    db.commit()
    db.refresh(like)
    return like


def unlike_reel(db: Session, user_id: int, reel_id: int) -> None:
    like = db.query(Like).filter(
        Like.user_id == user_id,
        Like.reel_id == reel_id
    ).first()
    if not like:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Like not found")

    db.delete(like)
    db.commit()


def get_liked_reels(db: Session, user_id: int) -> list[Like]:
    return db.query(Like).filter(Like.user_id == user_id).all()


def get_reel_like_count(db: Session, reel_id: int) -> int:
    return db.query(Like).filter(Like.reel_id == reel_id).count()