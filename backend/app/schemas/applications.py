"""
============================================================
CareerPilot AI — Application Tracker Schemas (Phase 8)
============================================================
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ApplicationItem(BaseModel):
    id: str
    job_id: Optional[str] = None
    job_title: str
    company_name: str
    location: Optional[str] = "Remote"
    salary_range: Optional[str] = None
    status: str = "applied"  # "wishlist" | "applied" | "interviewing" | "offer" | "rejected"
    applied_date: str
    notes: Optional[str] = ""
    job_url: Optional[str] = None
    cover_letter: Optional[str] = None


class ApplicationCreateRequest(BaseModel):
    job_title: str
    company_name: str
    location: Optional[str] = "Remote"
    salary_range: Optional[str] = None
    status: Optional[str] = "wishlist"
    notes: Optional[str] = ""
    job_url: Optional[str] = None


class ApplicationUpdateRequest(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    salary_range: Optional[str] = None
    cover_letter: Optional[str] = None


class CoverLetterGenerateRequest(BaseModel):
    job_title: str
    company_name: str
    job_description: Optional[str] = ""
    tone: Optional[str] = "Professional"  # "Professional" | "Enthusiastic" | "Executive"


class CoverLetterResponse(BaseModel):
    job_title: str
    company_name: str
    cover_letter: str
    key_selling_points: List[str]
