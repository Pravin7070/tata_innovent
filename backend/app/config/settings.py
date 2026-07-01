import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Explicitly load the .env file
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Backend Engine API"
    API_V1_STR: str = "/api/v1"
    
    # Database URL for SQLAlchemy. Defaults to local SQLite for development.
    # Set DATABASE_URL in the environment to override this value.
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./backend.db"
    )
    
    AI_ENGINE_URL: str = "http://localhost:8001" # Mock default URL for AI Engine
    WS_URL: str = "ws://localhost:8000/live"

    class Config:
        case_sensitive = True

settings = Settings()
