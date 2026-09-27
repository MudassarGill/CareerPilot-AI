"""
============================================================
CareerPilot AI — User Database Model
============================================================
Defines the Users table in PostgreSQL.

Table: users
Columns:
    id, email, name, hashed_password, is_active, is_verified,
    phone, target_role, verification_token, profile_completed,
    created_at, updated_at
============================================================
"""

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class User(Base):
    """User account model for authentication and profile."""

    __tablename__ = "users"

    # ---- Primary Key ----
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )

    # ---- Auth Fields ----
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    # ---- Profile Fields ----
    phone = Column(String(20), nullable=True)
    target_role = Column(String(255), nullable=True)
    profile_completed = Column(Boolean, default=False)

    # ---- Verification ----
    verification_token = Column(String(255), nullable=True)

    # ---- Timestamps ----
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, name={self.name})>"
