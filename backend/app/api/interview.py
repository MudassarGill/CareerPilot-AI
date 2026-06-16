"""
============================================================
CareerPilot AI — Interview API Routes
============================================================
Handles AI mock interview sessions.

Endpoints:
    POST /api/interview/start   → Start a mock interview for a role
    POST /api/interview/answer  → Submit an answer, get AI feedback
    GET  /api/interview/history → Get past interview sessions

TODO: Implement when Interview Agent is built (Phase 2, Week 7)
============================================================
"""

from fastapi import APIRouter

router = APIRouter()


@router.post("/start")
async def start_interview():
    """Start a new AI mock interview session."""
    return {"message": "Interview start endpoint — coming in Phase 2"}


@router.post("/answer")
async def submit_answer():
    """Submit an interview answer and receive AI feedback."""
    return {"message": "Answer submission endpoint — coming in Phase 2"}
