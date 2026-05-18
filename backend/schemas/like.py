from pydantic import BaseModel, ConfigDict
from datetime import datetime

class LikeCreate(BaseModel):
    user_id:int
    reel_id:int

class LikeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id:int
    reel_id:int
    created_at: datetime

