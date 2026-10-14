"""
============================================================
CareerPilot AI — Resume Pydantic Schemas
============================================================
Request/response shapes for resume upload, parsing, and ATS
scoring endpoints.
============================================================
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict
from datetime import datetime
from uuid import UUID


# ---- Resume Upload & Parsing ----

class ParsedSection(BaseModel):
    """A single extracted section from a resume."""
    name: str
    content: str
    quality_score: Optional[float] = None
    suggestions: List[str] = []


class ResumeUploadResponse(BaseModel):
    """Returned after a resume is uploaded and parsed."""
    id: UUID
    original_name: str
    status: str
    parsed_data: Optional[Dict] = None
    quality_score: Optional[float] = None
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ResumeListItem(BaseModel):
    """Summary item for the resume list endpoint."""
    id: UUID
    original_name: str
    status: str
    ats_score: Optional[float] = None
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ResumeDetailResponse(BaseModel):
    """Full resume detail with parsed data and analysis."""
    id: UUID
    original_name: str
    status: str
    parsed_data: Optional[Dict] = None
    ats_score: Optional[float] = None
    skill_gaps: Optional[List[str]] = None
    feedback: Optional[Dict] = None
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---- ATS Scoring ----

class ATSScoreRequest(BaseModel):
    """Request body for ATS scoring."""
    resume_id: UUID
    job_description: str


class KeywordGap(BaseModel):
    """A single missing keyword from ATS analysis."""
    keyword: str
    importance: str = "medium"  # high | medium | low


class SectionFeedback(BaseModel):
    """Feedback for a specific resume section."""
    section: str
    score: float
    feedback: str
    missing_keywords: List[str] = []


class ATSScoreResponse(BaseModel):
    """Returned after ATS scoring."""
    resume_id: UUID
    ats_score: float
    matched_keywords: List[str] = []
    missing_keywords: List[KeywordGap] = []
    section_feedback: List[SectionFeedback] = []
    summary: str = ""
