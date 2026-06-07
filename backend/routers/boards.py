from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.board import BoardCreate, BoardResponse, BoardReelCreate, BoardReelResponse
from schemas.like import LikeResponse
from services.board import create_board, get_user_boards, add_reel_to_board, remove_reel_from_board, delete_board
from services.like import get_liked_reels
from services.auth import get_current_user

router = APIRouter(prefix="/boards", tags=["Boards"])


@router.post("/", response_model=BoardResponse, status_code=201)
def create(
    data: BoardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_board(db, current_user.id, data)


@router.get("/", response_model=list[BoardResponse])
def get_my_boards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_boards(db, current_user.id)


@router.post("/{board_id}/reels", response_model=BoardReelResponse, status_code=201)
def add_reel(
    board_id: int,
    data: BoardReelCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return add_reel_to_board(db, board_id, data.reel_id)


@router.delete("/{board_id}/reels/{reel_id}", status_code=204)
def remove_reel(
    board_id: int,
    reel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    remove_reel_from_board(db, board_id, reel_id)


@router.delete("/{board_id}", status_code=204)
def delete(
    board_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    delete_board(db, board_id)


@router.get("/liked-reels", response_model=list[LikeResponse])
def liked_reels(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_liked_reels(db, current_user.id)