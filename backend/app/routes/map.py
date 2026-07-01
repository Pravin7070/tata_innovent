from fastapi import APIRouter
from pydantic import BaseModel
import asyncio

router = APIRouter()

class RouteRequest(BaseModel):
    start: str
    destination: str

@router.post("/map/route", tags=["Map"])
async def calculate_route(request: RouteRequest):
    """
    Mock endpoint to simulate route calculation.
    """
    # Simulate processing delay
    await asyncio.sleep(1.5)
    
    return {
        "status": "success",
        "message": f"Route calculated from {request.start} to {request.destination}",
        "distance": "12.5 km",
        "estimated_time": "24 mins"
    }
