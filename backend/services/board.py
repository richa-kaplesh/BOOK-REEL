from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.board import Board, BoardReel
from schemas.board import BoardCreate


def create_board(db: Session, user_id: int, data: BoardCreate) -> Board:
    board = Board(user_id=user_id, name=data.name)
    db.add(board)
    db.commit()
    db.refresh(board)
    return board


def get_user_boards(db: Session, user_id: int) -> list[Board]:
    return db.query(Board).filter(Board.user_id == user_id).all()


def add_reel_to_board(db: Session, board_id: int, reel_id: int) -> BoardReel:
    existing = db.query(BoardReel).filter(
        BoardReel.board_id == board_id,
        BoardReel.reel_id == reel_id
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reel already in board")

    board_reel = BoardReel(board_id=board_id, reel_id=reel_id)
    db.add(board_reel)
    db.commit()
    db.refresh(board_reel)
    return board_reel


def remove_reel_from_board(db: Session, board_id: int, reel_id: int) -> None:
    board_reel = db.query(BoardReel).filter(
        BoardReel.board_id == board_id,
        BoardReel.reel_id == reel_id
    ).first()
    if not board_reel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reel not in board")

    db.delete(board_reel)
    db.commit()


def delete_board(db: Session, board_id: int) -> None:
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")

    db.delete(board)
    db.commit()