import os
import sys
import logging
import asyncio

import importlib.util

# Load ai-engine/main.py explicitly to avoid collision with backend/main.py
AI_ENGINE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "ai-engine"))
main_py_path = os.path.join(AI_ENGINE_PATH, "main.py")

try:
    # Append to path instead of insert(0) so we don't accidentally override the backend's main.py
    if AI_ENGINE_PATH not in sys.path:
        sys.path.append(AI_ENGINE_PATH)
        
    spec = importlib.util.spec_from_file_location("ai_engine_main", main_py_path)
    ai_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(ai_module)
    AIEngine = ai_module.AIEngine
    
    # Initialize globally
    engine_instance = AIEngine()
    
    # CLEANUP: ai-engine/main.py aggressively inserts itself at sys.path[0].
    # We must remove it from the beginning and put it at the end to prevent 
    # Uvicorn from accidentally loading ai-engine/main.py instead of backend/main.py.
    while AI_ENGINE_PATH in sys.path:
        sys.path.remove(AI_ENGINE_PATH)
    sys.path.append(AI_ENGINE_PATH)
    
except Exception as e:
    engine_instance = None
    print(f"Warning: Could not initialize real AIEngine: {e}")

logger = logging.getLogger(__name__)

async def process_video_with_ai(filepath: str, video_id: int) -> dict:
    """
    Function to communicate with the AI engine via structured JSON.
    """
    logger.info(f"Sending video {video_id} at {filepath} to AI Engine")
    try:
        if engine_instance:
            # AIEngine is synchronous, we run it in a thread to avoid blocking asyncio event loop
            result = await asyncio.to_thread(engine_instance.analyze_video, filepath)
            return result
        else:
            logger.warning("AIEngine not initialized, returning mock data")
            return {
                "status": "success",
                "detections": [
                    {"class": "car", "confidence": 0.95, "bbox": [10, 20, 100, 200]},
                    {"class": "person", "confidence": 0.88, "bbox": [50, 60, 80, 150]}
                ],
                "vehicle_count": 1
            }
    except Exception as e:
        logger.error(f"Error communicating with AI engine: {str(e)}")
        return {"status": "error", "message": str(e)}
