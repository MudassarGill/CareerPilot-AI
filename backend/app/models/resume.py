"""
============================================================
CareerPilot AI — Resume Database Model
============================================================
Defines the Resumes table. Stores uploaded resume files,
their parsed content (as JSON), and analysis results.

Table: resumes
Columns:
    - id           : UUID primary key
    - user_id      : FK to users table
    - file_url     : Path/URL to the uploaded PDF/DOCX file
    - original_name: Original filename from upload
    - parsed_data  : JSON blob of extracted resume sections
    - ats_score    : Float 0-100 (ATS compatibility score)
    - skill_gaps   : JSON array of identified missing skills
    - feedback     : JSON object with section-by-section feedback
    - uploaded_at  : When the resume was uploaded
============================================================
"""

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base


class Resume(Base):
    """
    Resume model — stores uploaded resumes and their AI analysis.
    Each resume belongs to a single user.
    """

    __tablename__ = "resumes"

    # ---- Primary Key ----
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # ---- Foreign Key ----
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # ---- File Info ----
    file_url = Column(String(500), nullable=False)
    original_name = Column(String(255), nullable=False)

    # ---- Parsed & Analysis Data ----
    parsed_data = Column(JSON, nullable=True)   # Extracted sections as JSON
    ats_score = Column(Float, nullable=True)     # 0-100 score
    skill_gaps = Column(JSON, nullable=True)     # List of missing skills
    feedback = Column(JSON, nullable=True)       # Section-level feedback

    # ---- Timestamps ----
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # ---- Relationships ----
    # user = relationship("User", back_populates="resumes")

    def __repr__(self):
        return f"<Resume(id={self.id}, user={self.user_id}, score={self.ats_score})>"
