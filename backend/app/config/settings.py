import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Explicitly load the .env file
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Backend Engine API"
    API_V1_STR: str = "/api/v1"
    
    # Supabase PostgreSQL URL
    # Replace the placeholder with your actual Supabase connection string.
    # Format: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
    )
    
    AI_ENGINE_URL: str = "http://localhost:8001" # Mock default URL for AI Engine
    WS_URL: str = "ws://localhost:8000/live"

    class Config:
        case_sensitive = True

settings = Settings()
