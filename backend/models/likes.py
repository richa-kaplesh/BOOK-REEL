from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Integer, ForeignKey, UniqueConstraint
from database import Base
from sqlalchemy.orm import relationship

class Like(Base):
    __tablename__ = "likes"
    __table_args__ = (UniqueConstraint('user_id', 'reel_id' ),)

    id = Column(Integer, primary_key = True)
    user_id = Column(Integer , ForeignKey("users.id"), nullable=False)
    reel_id = Column(Integer , ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc ))
    user = relationship("User", back_populates="likes")
    reel = relationship("Reel", back_populates="likes") 
    

    


