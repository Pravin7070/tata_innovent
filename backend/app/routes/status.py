from fastapi import APIRouter
from edge.state_manager import get_status

router = APIRouter()

@router.get("/status", tags=["Status"])
async def status():
    return get_status()
