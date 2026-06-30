from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.database.database import Base, engine
from app.middleware.logging import LoggingMiddleware

# Import routers
from app.routes import upload, vehicle, detections, history, analytics, simulation, health
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

# WebSocket Router
app.include_router(ws.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
