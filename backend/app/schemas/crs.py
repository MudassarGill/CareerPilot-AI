"""
============================================================
CareerPilot AI — CRS Pydantic Schemas
============================================================
Request/response shapes for Career Readiness Score endpoints.
============================================================
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class CRSScoreResponse(BaseModel):
    """Current Career Readiness Score with breakdown."""
    score: float
    skills_part: float
    resume_part: float
    interview_part: float
    learning_part: float
    trend: int = 0  # +/- compared to previous score
    percentile_label: str = ""

    model_config = ConfigDict(from_attributes=True)


class CRSHistoryItem(BaseModel):
    """A single historical CRS entry."""
    id: UUID
    score: float
    skills_part: float
    resume_part: float
    interview_part: float
    learning_part: float
    calculated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CRSHistoryResponse(BaseModel):
    """List of historical CRS records."""
    history: List[CRSHistoryItem] = []
