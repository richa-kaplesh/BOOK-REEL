from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from database import Base


class Reel(Base):
    __tablename__ = "reels"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    type = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    order_index = Column(Integer, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    book = relationship("Book", back_populates="reels")
    voice_reel = relationship("VoiceReel", back_populates="reel", uselist=False)
    likes = relationship("Like", back_populates="reel")
    board_reels = relationship("BoardReel", back_populates="reel")


class VoiceReel(Base):
    __tablename__ = "voice_reels"

    id = Column(Integer, primary_key=True, index=True)
    reel_id = Column(Integer, ForeignKey("reels.id"), nullable=False)
    audio_url = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    reel = relationship("Reel", back_populates="voice_reel")