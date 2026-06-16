"""
============================================================
CareerPilot AI — Learning Roadmap API Routes
============================================================
Generates personalized learning roadmaps based on skill gaps.

Endpoints:
    POST /api/roadmap/generate → Generate a learning roadmap

TODO: Implement when Roadmap Agent is built (Phase 2, Week 6)
============================================================
"""

from fastapi import APIRouter

router = APIRouter()


@router.post("/generate")
async def generate_roadmap():
    """Generate a personalised learning roadmap."""
    return {"message": "Roadmap generation endpoint — coming in Phase 2"}
