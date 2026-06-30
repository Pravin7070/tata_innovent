from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class UploadResponse(BaseModel):
    message: str
    video_id: int
    filename: str

class VideoStatusResponse(BaseModel):
    id: int
    filename: str
    status: str
    uploaded_at: datetime

class DetectionResult(BaseModel):
    id: int
    video_id: int
    result_data: Dict[str, Any]
    created_at: datetime
    
class HistoryResponse(BaseModel):
    items: List[DetectionResult]
    total: int

class AnalyticsResponse(BaseModel):
    total_videos: int
    processed_videos: int
    total_detections: int

class SimulationResponse(BaseModel):
    message: str
    status: str
    simulation_data: Dict[str, Any]
