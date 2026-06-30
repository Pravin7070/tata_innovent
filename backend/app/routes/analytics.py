from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import VideoUpload, AnalysisResult
from app.schemas.schemas import AnalyticsResponse

router = APIRouter()

@router.get("/analytics", response_model=AnalyticsResponse, tags=["Analytics"])
async def get_analytics(db: Session = Depends(get_db)):
    """
    Returns aggregated analytics data based on processed videos.
    """
    total_videos = db.query(VideoUpload).count()
    processed_videos = db.query(VideoUpload).filter(VideoUpload.status == "completed").count()
    total_detections = db.query(AnalysisResult).count()
    
    # In a real app, you would parse the JSON results to count specific detection classes
    
    return {
        "total_videos": total_videos,
        "processed_videos": processed_videos,
        "total_detections": total_detections
    }
