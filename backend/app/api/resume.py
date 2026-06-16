"""
============================================================
CareerPilot AI — Resume API Routes
============================================================
Handles resume upload, parsing, and ATS scoring endpoints.

Endpoints:
    POST /api/resume/upload     → Upload & parse a resume (PDF/DOCX)
    POST /api/resume/ats-score  → Score resume against a job description

Flow:
    1. User uploads PDF/DOCX → saved to server
    2. Resume Agent parses file → extracts sections (spaCy NER)
    3. Text is embedded → stored in ChromaDB
    4. ATS Agent compares resume vs job description
    5. Returns: ATS score, keyword gaps, section feedback

TODO: Implement when Resume Agent is built (Phase 1, Week 2-3)
============================================================
"""

from fastapi import APIRouter

router = APIRouter()


# ---- Placeholder endpoints ----
# These will be implemented in Phase 1

@router.post("/upload")
async def upload_resume():
    """Upload and parse a resume file (PDF or DOCX)."""
    return {"message": "Resume upload endpoint — coming in Phase 1"}


@router.post("/ats-score")
async def ats_score():
    """Score a resume against a target job description."""
    return {"message": "ATS scoring endpoint — coming in Phase 1"}
