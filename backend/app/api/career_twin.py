"""
============================================================
CareerPilot AI — Career Twin API Routes (Phase 7)
============================================================
Simulates multi-year career paths, salary curves, promotion
probabilities, and 'What-If' scenarios based on the user's
profile and market demand.

Endpoints:
    POST /api/career-twin/simulate → Run multi-year career simulation
    GET  /api/career-twin/latest   → Fetch user's latest saved simulation
============================================================
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.database import get_db
from app.services.auth import get_current_user
from app.models.user import User
from app.models.career_profile import CareerProfile
from app.agents.career_twin_agent import CareerTwinAgent
from app.schemas.career_twin import (
    CareerTwinSimRequest,
    CareerTwinSimResponse,
)

router = APIRouter()
career_twin_agent = CareerTwinAgent()


@router.post("/simulate", response_model=CareerTwinSimResponse)
async def simulate_career(
    payload: CareerTwinSimRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Run a multi-year career trajectory simulation based on candidate's target role,
    geographic market, and ambition pace. Persists the simulation in CareerProfile.
    """
    try:
        sim_data = await career_twin_agent.simulate(
            target_role=payload.target_role,
            region=payload.region,
            ambition_level=payload.ambition_level,
            years_experience=payload.years_experience,
        )

        # Persist simulation in CareerProfile
        profile = (
            db.query(CareerProfile)
            .filter(CareerProfile.user_id == current_user.id)
            .first()
        )
        if not profile:
            profile = CareerProfile(
                user_id=current_user.id,
                target_role=payload.target_role,
                career_twin_data=sim_data,
                updated_at=datetime.utcnow(),
            )
            db.add(profile)
        else:
            profile.target_role = payload.target_role
            profile.career_twin_data = sim_data
            profile.updated_at = datetime.utcnow()

        db.commit()
        return sim_data
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate career simulation: {str(exc)}",
        )


@router.get("/latest", response_model=CareerTwinSimResponse)
async def get_latest_simulation(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get user's latest saved career twin simulation, or generate default simulation
    if none exists yet.
    """
    profile = (
        db.query(CareerProfile)
        .filter(CareerProfile.user_id == current_user.id)
        .first()
    )
    if profile and profile.career_twin_data:
        return profile.career_twin_data

    # Generate baseline simulation
    default_role = profile.target_role if profile and profile.target_role else "Frontend Developer"
    sim_data = await career_twin_agent.simulate(
        target_role=default_role,
        region="US Remote",
        ambition_level="accelerated",
        years_experience=2,
    )
    return sim_data
