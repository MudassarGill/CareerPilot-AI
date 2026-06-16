"""
============================================================
CareerPilot AI — User Database Model
============================================================
Defines the Users table in PostgreSQL. This model stores
user authentication credentials and basic profile info.

Table: users
Columns:
    - id            : UUID primary key (auto-generated)
    - email         : Unique email address for login
    - name          : User's full name
    - hashed_password: Bcrypt-hashed password (never store plain text!)
    - is_active     : Whether the account is active
    - created_at    : Timestamp when the account was created
    - updated_at    : Timestamp of last profile update

Relationships:
    - One User → Many Resumes
    - One User → Many Interviews
    - One User → One Career Profile
============================================================
"""

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base


class User(Base):
    """
    User account model.
    Stores authentication credentials and links to all
    user-owned resources (resumes, interviews, profiles).
    """

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

    # ---- Timestamps ----
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # ---- Relationships ----
    # These will be populated when the related models are created
    # resumes = relationship("Resume", back_populates="user")
    # interviews = relationship("Interview", back_populates="user")
    # career_profile = relationship("CareerProfile", back_populates="user", uselist=False)

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, name={self.name})>"
