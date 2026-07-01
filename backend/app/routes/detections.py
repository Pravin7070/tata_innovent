from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.database.database import get_db
from app.models.models import AnalysisResult
from edge.state_manager import get as get_edge_state

router = APIRouter()

@router.get("/detections", response_model=Dict[str, Any], tags=["Detections"])
async def get_detections(limit: int = 10, db: Session = Depends(get_db)):
    """
    Returns the latest live edge detection state.
    """
    state = get_edge_state()
    if state and state.get("detections") is not None:
        return state

    latest = db.query(AnalysisResult).order_by(AnalysisResult.created_at.desc()).first()
    if latest:
        return latest.result_data

    return {"detections": []}
