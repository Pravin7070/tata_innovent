from sqlalchemy import Column, Integer, String, DateTime, Float, JSON
from sqlalchemy.sql import func
from app.database.database import Base

class VideoUpload(Base):
    __tablename__ = "video_uploads"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    filepath = Column(String)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="processing") # processing, completed, failed

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, index=True)
    result_data = Column(JSON) # Store AI engine JSON output
    created_at = Column(DateTime(timezone=True), server_default=func.now())
