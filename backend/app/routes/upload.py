from fastapi import APIRouter, UploadFile, File, HTTPException
from edge.state_manager import get_status
from edge.manager import start_edge
from app.utils.file_handlers import save_upload_file

router = APIRouter()

@router.post("/start-inference", tags=["Edge Inference"])
async def start_inference(file: UploadFile | None = File(None)):
    """
    Start or confirm the edge inference pipeline.
    """
    source = None
    if file is not None:
        source = await save_upload_file(file)

    started = start_edge(source=source)
    if not started:
        raise HTTPException(status_code=500, detail="Failed to start edge inference.")

    return {
        "status": "started",
        "message": "Edge inference is running locally.",
        "edge_status": get_status()
    }
