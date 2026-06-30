from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.models import AnalysisResult
from app.schemas.schemas import DetectionResult

router = APIRouter()

@router.get("/detections", response_model=List[DetectionResult], tags=["Detections"])
async def get_detections(limit: int = 10, db: Session = Depends(get_db)):
    """
    Returns the latest detection results.
    """
    results = db.query(AnalysisResult).order_by(AnalysisResult.created_at.desc()).limit(limit).all()
    return results
