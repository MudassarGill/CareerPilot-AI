"""
============================================================
CareerPilot AI — Database Engine & Session Management
============================================================
Creates the SQLAlchemy async engine, session factory, and
declarative Base class used by all database models.

Key Components:
    - engine:       Async PostgreSQL connection engine
    - SessionLocal: Session factory for creating DB sessions
    - Base:         Declarative base for all ORM models
    - get_db():     Dependency injection for FastAPI routes

Usage in API routes:
    from app.db.database import get_db
    from sqlalchemy.orm import Session

    @router.get("/users")
    def get_users(db: Session = Depends(get_db)):
        return db.query(User).all()
============================================================
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

# ---- Database Engine ----
# Creates a connection pool to PostgreSQL
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,  # Log SQL queries in debug mode
    pool_pre_ping=True,   # Verify connections before use
)

# ---- Session Factory ----
# Each API request gets its own session via get_db()
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# ---- Declarative Base ----
# All ORM models inherit from this base class
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that provides a database session.
    Automatically closes the session when the request ends.

    Usage:
        @router.get("/items")
        def read_items(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
