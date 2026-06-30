from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import VideoUpload, AnalysisResult
from app.schemas.schemas import AnalyticsResponse

import os
import json

router = APIRouter()

@router.get("/analytics", tags=["Analytics"])
async def get_analytics(db: Session = Depends(get_db)):
    """
    Returns aggregated analytics data based on processed videos.
    """
    total_videos = db.query(VideoUpload).count()
    processed_videos = db.query(VideoUpload).filter(VideoUpload.status == "completed").count()
    total_detections = db.query(AnalysisResult).count()
    
    # Check for analytics metrics summary
    metrics_path = os.path.abspath(os.path.join(
        os.path.dirname(__file__), "..", "..", "..", "analytics", "output", "metrics_summary.json"
    ))
    
    extra_metrics = {}
    if os.path.exists(metrics_path):
        try:
            with open(metrics_path, 'r') as f:
                extra_metrics = json.load(f)
                # Override total_detections if it's 0 in DB
                if total_detections == 0 and "total_detections" in extra_metrics:
                    total_detections = extra_metrics["total_detections"]
        except Exception:
            pass
    
    return {
        "total_videos": total_videos,
        "processed_videos": processed_videos,
        "total_detections": total_detections,
        "extended_metrics": extra_metrics
    }
