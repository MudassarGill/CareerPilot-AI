"""
============================================================
CareerPilot AI — Career Readiness Score (CRS) API Routes
============================================================
Calculates and returns the user's Career Readiness Score.

Endpoints:
    GET /api/crs/score → Get composite CRS (0-100) with breakdown

TODO: Implement when CRS Agent is built (Phase 3, Week 9)
============================================================
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/score")
async def get_crs():
    """Get the user's Career Readiness Score with breakdown."""
    return {"message": "CRS scoring endpoint — coming in Phase 3"}
