"""
============================================================
CareerPilot AI — Career Readiness Score (CRS) API Routes
============================================================
Calculates and returns the user's composite Career Readiness Score
and historical progression.

Endpoints:
    GET /api/crs/score   → Current CRS composite score & 4 sub-metrics
    GET /api/crs/history → Historical score progression records
============================================================
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.auth import get_current_user
from app.models.user import User
from app.models.readiness import CareerReadinessScore
from app.services.readiness_service import calculate_readiness_score
from app.schemas.crs import (
    CRSScoreResponse,
    CRSHistoryItem,
    CRSHistoryResponse,
)

router = APIRouter()


def _get_percentile_label(score: float) -> str:
    if score >= 85:
        return "Top 5% Candidate"
    if score >= 75:
        return "Top 15% Candidate"
    if score >= 60:
        return "Top 30% Benchmark"
    if score >= 45:
        return "Competitive Profile"
    return "Foundation Building"


@router.get("/score", response_model=CRSScoreResponse)
def get_crs_score(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Computes or retrieves the current user's Career Readiness Score (0-100)
    with breakdowns for Skills, Resume, Interview, and Learning.
    """
    # Fetch historical records to compute trend
    scores = (
        db.query(CareerReadinessScore)
        .filter(CareerReadinessScore.user_id == current_user.id)
        .order_by(CareerReadinessScore.calculated_at.desc())
        .limit(2)
        .all()
    )

    # Calculate latest score
    latest_score = calculate_readiness_score(db, str(current_user.id))

    trend = 0
    if scores:
        prev = scores[0]
        trend = int(round(latest_score.score - prev.score))

    percentile = _get_percentile_label(latest_score.score)

    return CRSScoreResponse(
        score=latest_score.score,
        skills_part=latest_score.skills_part,
        resume_part=latest_score.resume_part,
        interview_part=latest_score.interview_part,
        learning_part=latest_score.learning_part,
        trend=trend,
        percentile_label=percentile,
    )


@router.get("/history", response_model=CRSHistoryResponse)
def get_crs_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns historical CRS records for trend chart visualization.
    """
    records = (
        db.query(CareerReadinessScore)
        .filter(CareerReadinessScore.user_id == current_user.id)
        .order_by(CareerReadinessScore.calculated_at.asc())
        .limit(20)
        .all()
    )

    items = [
        CRSHistoryItem(
            id=r.id,
            score=r.score,
            skills_part=r.skills_part,
            resume_part=r.resume_part,
            interview_part=r.interview_part,
            learning_part=r.learning_part,
            calculated_at=r.calculated_at,
        )
        for r in records
    ]

    return CRSHistoryResponse(history=items)
