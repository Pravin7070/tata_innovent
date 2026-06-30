from fastapi import APIRouter
from app.schemas.schemas import SimulationResponse

router = APIRouter()

@router.get("/simulation", response_model=SimulationResponse, tags=["Simulation"])
async def get_simulation_data():
    """
    Mock endpoint to return simulation environment data.
    """
    return {
        "message": "Simulation data retrieved successfully",
        "status": "running",
        "simulation_data": {
            "environment": "urban",
            "weather": "clear",
            "traffic_density": 0.65,
            "active_agents": 42
        }
    }
