"""
============================================================
CareerPilot AI — Jobs Pydantic Schemas (Phase 5+)
============================================================
Request and response models for Job Intelligence Matcher.
============================================================
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime


class JobItem(BaseModel):
    id: str
    title: str
    company: str
    location: str
    location_type: str  # "Remote" | "Hybrid" | "Onsite"
    salary_range: str
    experience_level: str  # "Junior" | "Mid-Level" | "Senior" | "Lead"
    category: str  # "Frontend" | "Backend" | "Full Stack" | "AI/ML" | "DevOps" | "Data"
    required_skills: List[str]
    description: str
    posted_date: str
    match_pct: float = 0.0
    matching_skills: List[str] = []
    missing_skills: List[str] = []
    company_url: Optional[str] = None
    job_url: Optional[str] = None
    google_jobs_url: Optional[str] = None
    linkedin_jobs_url: Optional[str] = None
    is_saved: bool = False
    status: str = "open"  # "open" | "saved" | "applied"


class JobSaveRequest(BaseModel):
    job_id: str


class JobApplyRequest(BaseModel):
    job_id: str
    notes: Optional[str] = None


class JobMarketSummary(BaseModel):
    total_jobs: int
    high_match_count: int
    average_match_pct: float
    top_demanded_skills: List[str]
    top_missing_skills: List[str]
