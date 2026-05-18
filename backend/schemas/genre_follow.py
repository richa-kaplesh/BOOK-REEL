from pydantic import BaseModel, ConfigDict
from datetime import datetime

class GenreFollowCreate(BaseModel):
    user_id:int
    genre:str

class GenreFollowResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id:int
    user_id:int
    genre:str
    created_at: datetime
