from pydantic import BaseModel, ConfigDict
from datetime import datetime


class ReelCreate(BaseModel):
    book_id : int
    type:str
    content: str
    order_index: int


class VoiceReelCreate(BaseModel):
    reel_id:int 
    audio_url:str

class ReelResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id:int
    created_at:datetime
    book_id : int
    type:str
    content: str
    order_index: int


class VoiceReelResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id:int
    created_at:datetime
    reel_id:int
    audio_url:str
