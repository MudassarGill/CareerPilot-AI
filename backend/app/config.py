"""
============================================================
CareerPilot AI — Application Configuration
============================================================
Centralised configuration management using Pydantic Settings.
All environment variables are loaded from the .env file and
validated at startup.
============================================================
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # ---- Project Info ----
    PROJECT_NAME: str = "CareerPilot AI"
    VERSION: str = "1.0.0"
    DEBUG: bool = True

    # ---- Database ----
    DATABASE_URL: str = "postgresql://career_ai_user:Mudassar1565%40@localhost:5432/career_ai_auth"

    # ---- ChromaDB Vector Store ----
    CHROMA_PERSIST_DIR: str = "./data/chroma_db"

    # ---- LLM API Keys ----
    GOOGLE_API_KEY: str = ""

    # ---- JWT Authentication ----
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    VERIFICATION_TOKEN_EXPIRE_HOURS: int = 24

    # ---- CORS ----
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # ---- Redis ----
    REDIS_URL: str = "redis://localhost:6379/0"

    # ---- Frontend ----
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
