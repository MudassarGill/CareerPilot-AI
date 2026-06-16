"""
============================================================
CareerPilot AI — Database Connection & Session Management
============================================================
This package handles all database-related operations:

    - database.py  → SQLAlchemy engine, session factory, Base model
    - migrations/  → Alembic migration scripts (auto-generated)

The application uses PostgreSQL as the primary database for
storing user data, resumes, interviews, and career profiles.

Connection Flow:
    1. Engine is created from DATABASE_URL in config
    2. SessionLocal factory creates per-request DB sessions
    3. get_db() dependency injects sessions into API routes
    4. Sessions are auto-closed after each request
============================================================
"""
