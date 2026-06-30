from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.models import VideoUpload
from app.schemas.schemas import VideoStatusResponse

router = APIRouter()

@router.get("/vehicle", response_model=List[VideoStatusResponse], tags=["Vehicle"])
async def get_vehicles(db: Session = Depends(get_db)):
    """
    Returns list of uploaded videos (considered 'vehicles' of data for the AI engine)
    and their processing status.
    """
    videos = db.query(VideoUpload).all()
    return videos
