from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Backend Engine API"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./backend.db"
    AI_ENGINE_URL: str = "http://localhost:8001" # Mock default URL for AI Engine
    WS_URL: str = "ws://localhost:8000/live"

    class Config:
        case_sensitive = True

settings = Settings()
