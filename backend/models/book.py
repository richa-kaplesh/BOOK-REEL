from sqlalchemy import Column , Integer, String , DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String , nullable=False)
    author =  Column(String , nullable=False)
    genre = Column(String, nullable=False)
    cover_image_url = Column(String, nullable = True)
    source_url = Column(String, nullable = True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    reels = relationship("Reel", back_populates="book")
    

