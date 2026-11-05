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

import os
import time
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

logger = logging.getLogger(__name__)

# Declarative Base
Base = declarative_base()

NEON_DATABASE_URL = "postgresql://neondb_owner:npg_if3vz4XPUOFV@ep-billowing-poetry-be91r04d-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require"


def create_db_engine():
    """
    Creates the SQLAlchemy engine. Uses Neon PostgreSQL for cloud production.
    """
    db_url = settings.DATABASE_URL or ""

    # Normalize standard Postgres URI scheme for SQLAlchemy 2.0+
    if db_url.startswith("postgres://"):
        db_url = "postgresql://" + db_url[len("postgres://"):]

    # On Render cloud production, ALWAYS enforce Neon PostgreSQL
    is_cloud_prod = bool(os.environ.get("RENDER") or os.environ.get("PORT"))
    if is_cloud_prod or not db_url or "sqlite" in db_url.lower():
        if is_cloud_prod:
            print("[INFO] Production cloud detected (Render): Enforcing Neon PostgreSQL database.")
            db_url = NEON_DATABASE_URL
        elif not db_url:
            db_url = NEON_DATABASE_URL

    if db_url.startswith("postgresql://"):
        for attempt in range(1, 4):
            try:
                pg_engine = create_engine(
                    db_url,
                    pool_pre_ping=True,
                    pool_recycle=300,
                    pool_size=5,
                    max_overflow=10,
                )
                with pg_engine.connect():
                    pass
                print(f"[INFO] Connected to PostgreSQL (Neon) successfully on attempt {attempt}.")
                return pg_engine
            except Exception as exc:
                print(f"[WARN] Neon PostgreSQL connection attempt {attempt} failed: {exc}")
                if attempt < 3:
                    time.sleep(2)
                else:
                    if is_cloud_prod:
                        print("[WARN] Cloud production: Returning Neon engine with pool_pre_ping to allow auto-reconnect.")
                        return create_engine(db_url, pool_pre_ping=True, pool_recycle=300)

        # Fallback for offline local dev only
        print("[INFO] Falling back to local SQLite database ('career_ai.db') for offline local dev.")
        return create_engine("sqlite:///./career_ai.db", connect_args={"check_same_thread": False})

    return create_engine(db_url, connect_args={"check_same_thread": False} if "sqlite" in db_url else {})


# ---- Database Engine ----
engine = create_db_engine()

# ---- Session Factory ----
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    """FastAPI dependency that provides a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
