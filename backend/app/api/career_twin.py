"""
============================================================
CareerPilot AI — Career Twin API Routes
============================================================
Simulates future career trajectories based on user profile.

Endpoints:
    POST /api/career-twin/simulate → Run career simulation

TODO: Implement when Career Twin Agent is built (Phase 3, Week 10)
============================================================
"""

from fastapi import APIRouter

router = APIRouter()


@router.post("/simulate")
async def simulate_career():
    """Simulate future career trajectory (1yr/3yr/5yr)."""
    return {"message": "Career Twin simulation endpoint — coming in Phase 3"}
