"""
============================================================
CareerPilot AI — Job Intelligence Matcher API (Phase 5+)
============================================================
Handles automated ATS job matching, skill gap discovery vs
live market openings, application preparation checklists,
and saved job trackers.

Endpoints:
    GET  /api/jobs           → List jobs with personalized match %
    GET  /api/jobs/summary   → Market readiness & skill demand summary
    POST /api/jobs/save      → Bookmark/unbookmark a job
    POST /api/jobs/apply     → Track job application
============================================================
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.auth import get_current_user
from app.models.user import User
from app.models.skill import UserSkill, Skill
from app.models.resume import Resume
from app.schemas.jobs import (
    JobItem,
    JobSaveRequest,
    JobApplyRequest,
    JobMarketSummary,
)
from app.services.job_search_service import get_realtime_jobs

router = APIRouter()

# Comprehensive curated high-growth tech positions database
TECH_JOBS_CATALOG = []

USER_JOB_STATES = {}  # { f"{user_id}:{job_id}": { "saved": bool, "applied": bool } }


def _get_user_skill_names(db: Session, user_id) -> List[str]:
    """Retrieve all skills associated with current user."""
    names = []
    try:
        skills = (
            db.query(Skill.name)
            .join(UserSkill, UserSkill.skill_id == Skill.id)
            .filter(UserSkill.user_id == user_id)
            .all()
        )
        names = [s[0].lower() for s in skills]

        # Also check latest parsed resume for extracted technical skills
        latest_resume = (
            db.query(Resume)
            .filter(Resume.user_id == user_id)
            .order_by(Resume.uploaded_at.desc())
            .first()
        )
        if latest_resume and latest_resume.parsed_data:
            res_skills = latest_resume.parsed_data.get("skills", [])
            if isinstance(res_skills, list):
                for item in res_skills:
                    if isinstance(item, str) and item.lower() not in names:
                        names.append(item.lower())
    except Exception as exc:
        print(f"[WARN] Error fetching user skills for jobs: {exc}")

    return names


@router.get("", response_model=List[JobItem])
def get_matched_jobs(
    search: Optional[str] = None,
    category: Optional[str] = None,
    location_type: Optional[str] = None,
    min_match: Optional[float] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get all live jobs with personalized ATS and skill match percentages
    computed against the current authenticated user's profile.
    """
    matched_results = []
    try:
        user_skills = _get_user_skill_names(db, current_user.id)
    except Exception as e:
        print(f"[WARN] Error in _get_user_skill_names: {e}")
        user_skills = []

    active_jobs = get_realtime_jobs(
        search_query=search,
        user_skills=user_skills,
        category=category,
        location_type=location_type,
    )

    for job in active_jobs:
        try:
            # Category filter
            if category and category.lower() != "all" and job["category"].lower() != category.lower():
                continue

            # Location filter
            if location_type and location_type.lower() != "all" and job["location_type"].lower() != location_type.lower():
                continue

            # Search query filter
            if search:
                query = search.lower()
                in_title = query in job["title"].lower()
                in_company = query in job["company"].lower()
                in_desc = query in job["description"].lower()
                in_skills = any(query in sk.lower() for sk in job["required_skills"])
                if not (in_title or in_company or in_desc or in_skills):
                    continue

            # Calculate matching and missing skills
            matching_skills = []
            missing_skills = []

            for req in job["required_skills"]:
                req_clean = req.lower()
                is_matched = any(
                    req_clean in u_sk or u_sk in req_clean for u_sk in user_skills
                )
                if is_matched:
                    matching_skills.append(req)
                else:
                    missing_skills.append(req)

            total_req = len(job["required_skills"])
            if total_req > 0:
                match_pct = round((len(matching_skills) / total_req) * 100.0, 1)
            else:
                match_pct = 70.0

            # Optional threshold filter
            if min_match and match_pct < min_match:
                continue

            state_key = f"{str(current_user.id)}:{job['id']}"
            user_state = USER_JOB_STATES.get(state_key, {"saved": False, "applied": False})

            status_str = "applied" if user_state.get("applied") else ("saved" if user_state.get("saved") else "open")

            matched_results.append(
                JobItem(
                    id=job["id"],
                    title=job["title"],
                    company=job["company"],
                    location=job["location"],
                    location_type=job["location_type"],
                    salary_range=job["salary_range"],
                    experience_level=job["experience_level"],
                    category=job["category"],
                    required_skills=job["required_skills"],
                    description=job["description"],
                    posted_date=job["posted_date"],
                    match_pct=match_pct,
                    matching_skills=matching_skills,
                    missing_skills=missing_skills,
                    company_url=job.get("company_url"),
                    job_url=job.get("job_url"),
                    google_jobs_url=job.get("google_jobs_url"),
                    linkedin_jobs_url=job.get("linkedin_jobs_url"),
                    is_saved=user_state.get("saved", False),
                    status=status_str,
                )
            )
        except Exception as job_err:
            print(f"[WARN] Error matching single job {job.get('id')}: {job_err}")
            continue

    # Sort primarily by match percentage descending
    matched_results.sort(key=lambda j: j.match_pct, reverse=True)
    return matched_results


@router.get("/summary", response_model=JobMarketSummary)
def get_market_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get aggregated market readiness summary and top demanded skills.
    """
    try:
        user_skills = _get_user_skill_names(db, current_user.id)
    except Exception as e:
        print(f"[WARN] Error fetching user skills for summary: {e}")
        user_skills = []

    all_scores = []
    missing_frequency = {}
    demanded_frequency = {}

    active_jobs = get_realtime_jobs(user_skills=user_skills)

    for job in active_jobs:
        try:
            matching_count = 0
            for req in job["required_skills"]:
                demanded_frequency[req] = demanded_frequency.get(req, 0) + 1
                req_clean = req.lower()
                if any(req_clean in u or u in req_clean for u in user_skills):
                    matching_count += 1
                else:
                    missing_frequency[req] = missing_frequency.get(req, 0) + 1

            total = len(job["required_skills"])
            score = (matching_count / total * 100.0) if total > 0 else 70.0
            all_scores.append(score)
        except Exception:
            continue

    avg_score = round(sum(all_scores) / len(all_scores), 1) if all_scores else 0.0
    high_match = sum(1 for s in all_scores if s >= 75.0)

    # Sort demanded and missing skills by frequency
    sorted_demanded = sorted(demanded_frequency.keys(), key=lambda k: demanded_frequency[k], reverse=True)[:5]
    sorted_missing = sorted(missing_frequency.keys(), key=lambda k: missing_frequency[k], reverse=True)[:5]

    return JobMarketSummary(
        total_jobs=len(active_jobs),
        high_match_count=high_match,
        average_match_pct=avg_score,
        top_demanded_skills=sorted_demanded,
        top_missing_skills=sorted_missing,
    )


@router.post("/save")
def toggle_save_job(
    payload: JobSaveRequest,
    current_user: User = Depends(get_current_user),
):
    """Bookmark or unbookmark a job posting."""
    state_key = f"{str(current_user.id)}:{payload.job_id}"
    current_state = USER_JOB_STATES.get(state_key, {"saved": False, "applied": False})
    new_saved = not current_state["saved"]
    current_state["saved"] = new_saved
    USER_JOB_STATES[state_key] = current_state

    return {
        "job_id": payload.job_id,
        "is_saved": new_saved,
        "message": "Job bookmarked" if new_saved else "Job removed from bookmarks",
    }


@router.post("/apply")
def apply_to_job(
    payload: JobApplyRequest,
    current_user: User = Depends(get_current_user),
):
    """Mark a job as applied and track in candidate log."""
    state_key = f"{str(current_user.id)}:{payload.job_id}"
    current_state = USER_JOB_STATES.get(state_key, {"saved": False, "applied": False})
    current_state["applied"] = True
    USER_JOB_STATES[state_key] = current_state

    # Automatically add to user's live Applications Pipeline
    from app.api.applications import USER_APPLICATIONS
    uid = str(current_user.id)
    if uid not in USER_APPLICATIONS:
        USER_APPLICATIONS[uid] = []

    # Find job info from catalog or cache
    job_info = None
    for j in TECH_JOBS_CATALOG:
        if j["id"] == payload.job_id:
            job_info = j
            break
    if not job_info:
        from app.services.job_search_service import _JOB_CACHE
        for entry in _JOB_CACHE.values():
            for cj in entry.get("jobs", []):
                if cj["id"] == payload.job_id:
                    job_info = cj
                    break
            if job_info:
                break

    title = job_info.get("title", "Software Position") if job_info else "Software Position"
    company = job_info.get("company", "Tech Company") if job_info else "Tech Company"
    location = job_info.get("location", "Remote") if job_info else "Remote"
    salary = job_info.get("salary_range", "Market Competitive") if job_info else "Market Competitive"
    job_url = job_info.get("job_url", "") if job_info else ""

    if not any(a.get("job_id") == payload.job_id for a in USER_APPLICATIONS[uid]):
        import uuid
        USER_APPLICATIONS[uid].insert(0, {
            "id": f"app_{uuid.uuid4().hex[:8]}",
            "job_id": payload.job_id,
            "job_title": title,
            "company_name": company,
            "location": location,
            "salary_range": salary,
            "status": "applied",
            "applied_date": "Just now",
            "notes": "Applied with candidate profile and verified skills.",
            "job_url": job_url,
            "cover_letter": None,
        })

    return {
        "job_id": payload.job_id,
        "status": "applied",
        "message": f"Successfully applied to {title} at {company}! Added to your Application Pipeline.",
    }
