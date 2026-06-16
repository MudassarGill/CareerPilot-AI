"""
============================================================
CareerPilot AI — Application Configuration
============================================================
Centralised configuration management using Pydantic Settings.
All environment variables are loaded from the .env file and
validated at startup.

This module provides:
    - Database connection settings (PostgreSQL URL)
    - ChromaDB vector store path
    - LLM API keys (Google Gemini / OpenAI)
    - JWT authentication secrets
    - CORS allowed origins
    - Redis cache URL

Usage:
    from app.config import settings
    print(settings.DATABASE_URL)
============================================================
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Each field maps to an env var of the same name.
    """

    # ---- Project Info ----
    PROJECT_NAME: str = "CareerPilot AI"
    VERSION: str = "1.0.0"
    DEBUG: bool = True

    # ---- Database ----
    DATABASE_URL: str = "postgresql://careerpilot:careerpilot_secret@localhost:5432/careerpilot_db"

    # ---- ChromaDB Vector Store ----
    CHROMA_PERSIST_DIR: str = "./data/chroma_db"

    # ---- LLM API Keys ----
    GOOGLE_API_KEY: str = ""
    # OPENAI_API_KEY: str = ""  # Optional fallback

    # ---- JWT Authentication ----
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # ---- CORS ----
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # ---- Redis ----
    REDIS_URL: str = "redis://localhost:6379/0"

    class Config:
        """Load variables from .env file in the project root."""
        env_file = ".env"
        env_file_encoding = "utf-8"


# ---- Singleton Settings Instance ----
# Import this throughout the app: from app.config import settings
settings = Settings()
