from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.database.database import Base, engine
from app.middleware.logging import LoggingMiddleware

from edge.manager import edge_manager
from edge.state_manager import get_status as get_edge_status

# Import routers
from app.routes import upload, vehicle, detections, history, analytics, simulation, health, dashboard, map, settings as settings_route, status as status_route
from app.websocket import ws

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend for AI Engine interaction",
    version="1.0.0",
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LoggingMiddleware)

# REST API Routers
app.include_router(upload.router)
app.include_router(vehicle.router)
app.include_router(detections.router)
app.include_router(history.router)
app.include_router(analytics.router)
app.include_router(simulation.router)
app.include_router(health.router)
app.include_router(dashboard.router)
app.include_router(map.router)
app.include_router(settings_route.router)


# WebSocket Router
app.include_router(ws.router)
app.include_router(status_route.router)

from fastapi.staticfiles import StaticFiles
import os

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)

@app.on_event("shutdown")
async def shutdown_event():
    edge_manager.stop()

app.mount("/videos", StaticFiles(directory="uploads"), name="videos")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
