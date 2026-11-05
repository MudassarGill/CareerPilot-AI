"""
============================================================
CareerPilot AI — Database Engine & Session Management
============================================================
Creates the SQLAlchemy connection engine, session factory, and
declarative Base class used by all database models.

Key Components:
    - engine:       Database connection engine (PostgreSQL / SQLite fallback)
    - SessionLocal: Session factory for creating DB sessions
    - Base:         Declarative base for all ORM models
    - get_db():     Dependency injection for FastAPI routes
============================================================
"""

import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

logger = logging.getLogger(__name__)

# Declarative Base
Base = declarative_base()

def create_db_engine():
    """
    Creates the SQLAlchemy engine. Attempts PostgreSQL connection (e.g. Neon PostgreSQL);
    if the database does not exist or PostgreSQL is unreachable,
    gracefully falls back to local SQLite for seamless testing.
    """
    db_url = settings.DATABASE_URL or ""

    # Normalize standard Postgres URI scheme for SQLAlchemy 2.0+
    if db_url.startswith("postgres://"):
        db_url = "postgresql://" + db_url[len("postgres://"):]

    if db_url.startswith("postgresql://"):
        try:
            # Test if postgres connection can be made
            test_engine = create_engine(db_url, pool_pre_ping=True)
            with test_engine.connect():
                pass
            print("[INFO] Connected to PostgreSQL (Neon) database successfully.")
            return test_engine
        except Exception as exc:
            print(f"[INFO] PostgreSQL connection notice: {exc}")
            print("[INFO] Falling back to local SQLite database ('career_ai.db') for seamless execution.")
            print("[INFO] To use Neon PostgreSQL, set DATABASE_URL in Render environment variables.")
            fallback_url = "sqlite:///./career_ai.db"
            return create_engine(fallback_url, connect_args={"check_same_thread": False})
    
    if db_url.startswith("sqlite"):
        return create_engine(db_url, connect_args={"check_same_thread": False})

    return create_engine(db_url)

# ---- Database Engine ----
engine = create_db_engine()

# ---- Session Factory ----
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

def get_db():
    """
    FastAPI dependency that provides a database session.
    Automatically closes the session when the request ends.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
