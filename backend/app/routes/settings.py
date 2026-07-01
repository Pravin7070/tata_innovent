from fastapi import APIRouter
import asyncio

router = APIRouter()

@router.post("/settings/reset", tags=["Settings"])
async def reset_system():
    """
    Mock endpoint to simulate system reset.
    """
    await asyncio.sleep(2)
    return {"status": "success", "message": "System reset successfully."}

@router.post("/settings/diagnostics", tags=["Settings"])
async def run_diagnostics():
    """
    Mock endpoint to simulate running diagnostics.
    """
    await asyncio.sleep(3)
    return {
        "status": "success",
        "message": "Diagnostics completed. All systems nominal.",
        "issues_found": 0
    }
