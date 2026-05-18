from pydantic import BaseModel, ConfigDict
from datetime import datetime

class BoardCreate(BaseModel):
    user_id:int
    name:str

class BoardResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id:int
    created_at:datetime
    user_id:int
    name : str

class BoardReelCreate(BaseModel):
    board_id: int
    reel_id:int

class BoardReelResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id:int
    created_at:datetime
    board_id: int
    reel_id:int
