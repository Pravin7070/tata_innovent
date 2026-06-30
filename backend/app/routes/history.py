from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import AnalysisResult
from app.schemas.schemas import HistoryResponse

router = APIRouter()

@router.get("/history", response_model=HistoryResponse, tags=["History"])
async def get_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Returns historical analysis records with pagination.
    """
    total = db.query(AnalysisResult).count()
    items = db.query(AnalysisResult).order_by(AnalysisResult.created_at.desc()).offset(skip).limit(limit).all()
    
    return {"total": total, "items": items}
