"""
============================================================
CareerPilot AI — Application Tracker & Cover Letter API (Phase 8)
============================================================
Endpoints:
    GET    /api/applications                     → List tracked applications
    POST   /api/applications                     → Add application to tracker
    PUT    /api/applications/{id}                → Update status/notes
    DELETE /api/applications/{id}                → Remove from tracker
    POST   /api/applications/generate-cover-letter → Generate AI cover letter
============================================================
"""

import uuid
from typing import List, Dict, Any
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.auth import get_current_user
from app.models.user import User
from app.models.skill import UserSkill, Skill
from app.models.resume import Resume
from app.schemas.applications import (
    ApplicationItem,
    ApplicationCreateRequest,
    ApplicationUpdateRequest,
    CoverLetterGenerateRequest,
    CoverLetterResponse,
)
from app.agents.cover_letter_agent import generate_tailored_cover_letter

router = APIRouter()

# In-memory application store per user session (fallback & fast responsive updates)
USER_APPLICATIONS: Dict[str, List[Dict[str, Any]]] = {}

# Default initial demo tracked applications if user has none
DEFAULT_APPLICATIONS = [
    {
        "id": "app_1",
        "job_id": "job_ai_1",
        "job_title": "AI / RAG Solutions Engineer",
        "company_name": "Anthropic Partner Network",
        "location": "Remote",
        "salary_range": "$160,000 - $195,000",
        "status": "interviewing",
        "applied_date": "2 days ago",
        "notes": "Technical screening scheduled with engineering manager.",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=AI+RAG+Solutions+Engineer+Anthropic",
        "cover_letter": None,
    },
    {
        "id": "app_2",
        "job_id": "job_fe_1",
        "job_title": "Senior Frontend Engineer (React / Next.js)",
        "company_name": "Vercel Partner Labs",
        "location": "Remote",
        "salary_range": "$140,000 - $175,000",
        "status": "applied",
        "applied_date": "4 days ago",
        "notes": "Submitted via official partner portal with tailored resume.",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Senior+Frontend+Engineer+React+Next.js+Vercel",
        "cover_letter": None,
    },
    {
        "id": "app_3",
        "job_id": "job_be_1",
        "job_title": "Backend Systems Engineer (Python / FastAPI)",
        "company_name": "ScaleAI Infrastructure",
        "location": "Hybrid",
        "salary_range": "$135,000 - $165,000",
        "status": "wishlist",
        "applied_date": "Saved",
        "notes": "Reviewing system architecture fundamentals before applying.",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Backend+Systems+Engineer+Python+FastAPI+Scale+AI",
        "cover_letter": None,
    },
]


def _get_user_skills(db: Session, user_id) -> List[str]:
    names = []
    try:
        skills = (
            db.query(Skill.name)
            .join(UserSkill, UserSkill.skill_id == Skill.id)
            .filter(UserSkill.user_id == user_id)
            .all()
        )
        names = [s[0] for s in skills]
        latest_res = db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.uploaded_at.desc()).first()
        if latest_res and latest_res.parsed_data:
            r_sk = latest_res.parsed_data.get("skills", [])
            if isinstance(r_sk, list):
                for sk in r_sk:
                    if isinstance(sk, str) and sk not in names:
                        names.append(sk)
    except Exception:
        pass
    return names


@router.get("", response_model=List[ApplicationItem])
def list_applications(current_user: User = Depends(get_current_user)):
    """Retrieve all tracked job applications for current user."""
    uid = str(current_user.id)
    if uid not in USER_APPLICATIONS:
        # Initialize with structured starter items
        USER_APPLICATIONS[uid] = [dict(item) for item in DEFAULT_APPLICATIONS]
    return [ApplicationItem(**item) for item in USER_APPLICATIONS[uid]]


@router.post("", response_model=ApplicationItem)
def create_application(
    payload: ApplicationCreateRequest,
    current_user: User = Depends(get_current_user),
):
    """Add a new job application to the Kanban tracker."""
    uid = str(current_user.id)
    if uid not in USER_APPLICATIONS:
        USER_APPLICATIONS[uid] = [dict(item) for item in DEFAULT_APPLICATIONS]

    new_app = {
        "id": f"app_{uuid.uuid4().hex[:8]}",
        "job_id": None,
        "job_title": payload.job_title,
        "company_name": payload.company_name,
        "location": payload.location or "Remote",
        "salary_range": payload.salary_range or "Market Competitive",
        "status": payload.status or "wishlist",
        "applied_date": datetime.now().strftime("%b %d, %Y"),
        "notes": payload.notes or "",
        "job_url": payload.job_url,
        "cover_letter": None,
    }
    USER_APPLICATIONS[uid].insert(0, new_app)
    return ApplicationItem(**new_app)


@router.put("/{app_id}", response_model=ApplicationItem)
def update_application(
    app_id: str,
    payload: ApplicationUpdateRequest,
    current_user: User = Depends(get_current_user),
):
    """Update status, notes, or cover letter for an application."""
    uid = str(current_user.id)
    apps = USER_APPLICATIONS.get(uid, [])
    for app_item in apps:
        if app_item["id"] == app_id:
            if payload.status is not None:
                app_item["status"] = payload.status
            if payload.notes is not None:
                app_item["notes"] = payload.notes
            if payload.salary_range is not None:
                app_item["salary_range"] = payload.salary_range
            if payload.cover_letter is not None:
                app_item["cover_letter"] = payload.cover_letter
            return ApplicationItem(**app_item)

    raise HTTPException(status_code=404, detail="Application not found")


@router.delete("/{app_id}")
def delete_application(
    app_id: str,
    current_user: User = Depends(get_current_user),
):
    """Remove application from tracker."""
    uid = str(current_user.id)
    if uid in USER_APPLICATIONS:
        USER_APPLICATIONS[uid] = [a for a in USER_APPLICATIONS[uid] if a["id"] != app_id]
    return {"message": "Application deleted successfully"}


@router.post("/generate-cover-letter", response_model=CoverLetterResponse)
def generate_cover_letter(
    payload: CoverLetterGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate tailored, role-specific cover letter."""
    user_skills = _get_user_skills(db, current_user.id)
    candidate_name = getattr(current_user, "full_name", None) or "Candidate"

    result = generate_tailored_cover_letter(
        candidate_name=candidate_name,
        target_role=payload.job_title,
        company_name=payload.company_name,
        job_description=payload.job_description or "",
        user_skills=user_skills,
        tone=payload.tone or "Professional",
    )

    return CoverLetterResponse(**result)
