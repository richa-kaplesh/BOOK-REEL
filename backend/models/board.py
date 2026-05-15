from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from database import Base


class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="boards")
    board_reels = relationship("BoardReel", back_populates="board")


class BoardReel(Base):
    __tablename__ = "board_reels"
    __table_args__ = (UniqueConstraint("board_id", "reel_id"),)

    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.id"), nullable=False)
    reel_id = Column(Integer, ForeignKey("reels.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    board = relationship("Board", back_populates="board_reels")
    reel = relationship("Reel", back_populates="board_reels")