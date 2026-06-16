"""
============================================================
CareerPilot AI — Career Profile Database Model
============================================================
Stores the user's career profile including target role,
current skills, Career Readiness Score (CRS), learning
roadmap, and Career Twin simulation data.

Table: career_profiles
Columns:
    - id               : UUID primary key
    - user_id          : FK to users table (one-to-one)
    - target_role      : The job role the user is targeting
    - current_skills   : JSON array of current skills
    - crs_score        : Float 0-100 (Career Readiness Score)
    - crs_breakdown    : JSON with per-component CRS scores
    - roadmap          : JSON learning roadmap data
    - career_twin_data : JSON career simulation results
    - updated_at       : Last update timestamp
============================================================
"""

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class CareerProfile(Base):
    """
    Career Profile model — one per user.
    Aggregates all career intelligence data in one place.
    """

    __tablename__ = "career_profiles"

    # ---- Primary Key ----
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # ---- Foreign Key (One-to-One with User) ----
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)

    # ---- Career Info ----
    target_role = Column(String(255), nullable=True)
    current_skills = Column(JSON, nullable=True)    # ["Python", "React", ...]

    # ---- Career Readiness Score ----
    crs_score = Column(Float, nullable=True)         # Composite 0-100
    crs_breakdown = Column(JSON, nullable=True)      # {resume: 85, skills: 70, ...}

    # ---- Generated Plans ----
    roadmap = Column(JSON, nullable=True)            # Learning roadmap structure
    career_twin_data = Column(JSON, nullable=True)   # Simulation results

    # ---- Timestamps ----
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<CareerProfile(user={self.user_id}, role={self.target_role}, crs={self.crs_score})>"
