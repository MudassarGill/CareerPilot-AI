"""
============================================================
CareerPilot AI — Interview Database Model
============================================================
Stores AI mock interview sessions, including generated
questions, user answers, AI feedback, and overall scores.

Table: interviews
Columns:
    - id            : UUID primary key
    - user_id       : FK to users table
    - role          : Target role for the interview
    - interview_type: 'text', 'voice', or 'video'
    - questions     : JSON array of generated questions
    - answers       : JSON array of user responses
    - feedback      : JSON per-question AI feedback
    - overall_score : Float 0-100
    - conducted_at  : When the interview took place
============================================================
"""

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class Interview(Base):
    """
    Interview model — stores each mock interview session.
    A user can have many interviews over time.
    """

    __tablename__ = "interviews"

    # ---- Primary Key ----
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # ---- Foreign Key ----
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # ---- Interview Config ----
    role = Column(String(255), nullable=False)         # e.g., "Full Stack Developer"
    interview_type = Column(String(50), default="text") # text | voice | video

    # ---- Q&A Data ----
    questions = Column(JSON, nullable=True)   # [{"q": "...", "type": "technical"}, ...]
    answers = Column(JSON, nullable=True)     # [{"a": "...", "duration_sec": 45}, ...]
    feedback = Column(JSON, nullable=True)    # [{"score": 8, "feedback": "..."}, ...]

    # ---- Overall Score ----
    overall_score = Column(Float, nullable=True)  # 0-100

    # ---- Timestamps ----
    conducted_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Interview(id={self.id}, role={self.role}, score={self.overall_score})>"
