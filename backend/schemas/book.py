from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class BookCreate(BaseModel):
    title:str
    author :str
    genre: str
    cover_image_url: Optional[str] = None
    source_url:Optional[str] = None

class BookResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    author: str
    genre: str
    cover_image_url: Optional[str] = None
    source_url: Optional[str] = None
    created_at: datetime