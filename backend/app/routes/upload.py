from fastapi import APIRouter, UploadFile, File, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import VideoUpload, AnalysisResult
from app.schemas.schemas import UploadResponse
from app.utils.file_handlers import save_upload_file
from app.services.ai_engine import process_video_with_ai

router = APIRouter()

async def background_ai_processing(filepath: str, video_id: int, db: Session):
    # Call AI Engine
    result = await process_video_with_ai(filepath, video_id)
    
    # Update video status
    video = db.query(VideoUpload).filter(VideoUpload.id == video_id).first()
    if video:
        video.status = "completed" if result.get("status") == "success" else "failed"
        db.commit()
    
    # Store result
    analysis_record = AnalysisResult(
        video_id=video_id,
        result_data=result
    )
    db.add(analysis_record)
    db.commit()


@router.post("/upload", response_model=UploadResponse, tags=["Upload"])
async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only videos are allowed.")
        
    # Save file
    file_path = await save_upload_file(file)
    
    # Create DB record
    new_video = VideoUpload(filename=file.filename, filepath=file_path)
    db.add(new_video)
    db.commit()
    db.refresh(new_video)
    
    # Process in background
    background_tasks.add_task(background_ai_processing, file_path, new_video.id, db)
    
    return UploadResponse(
        message="Video uploaded successfully and is being processed.",
        video_id=new_video.id,
        filename=new_video.filename
    )
