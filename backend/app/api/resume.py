"""
============================================================
CareerPilot AI — Resume API Routes
============================================================
Handles resume upload, parsing, file management, and ATS scoring.

Endpoints:
    POST   /api/resume/upload     → Upload & parse resume (PDF/DOCX)
    GET    /api/resume/list       → List all resumes for current user
    GET    /api/resume/{resume_id}→ Get full resume detail & parsed sections
    DELETE /api/resume/{resume_id}→ Delete resume & associated file
    POST   /api/resume/ats-score  → Score resume against job description
============================================================
"""

from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.auth import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.services.storage_service import StorageService
from app.agents.resume_agent import ResumeAnalyzerAgent
from app.agents.ats_agent import ATSAgent
from app.schemas.resume import (
    ResumeUploadResponse,
    ResumeListItem,
    ResumeDetailResponse,
    ATSScoreRequest,
    ATSScoreResponse,
    KeywordGap,
    SectionFeedback,
)

router = APIRouter()
resume_agent = ResumeAnalyzerAgent()
ats_agent = ATSAgent()


@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload and parse a resume file (PDF or DOCX).
    Saves file to disk, runs ResumeAnalyzerAgent, and stores structured sections.
    """
    # 1. Save file to disk
    file_path, file_url = await StorageService.save_resume_file(file, str(current_user.id))

    # 2. Parse resume
    parsed_data = await resume_agent.parse_resume(file_path)
    if "error" in parsed_data:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=parsed_data["error"],
        )

    # 3. Evaluate initial quality score
    quality_result = await resume_agent.evaluate_quality(parsed_data)
    initial_score = float(quality_result.get("overall_score", 65.0))

    # 4. Store in database
    resume_record = Resume(
        user_id=current_user.id,
        file_url=file_url,
        original_name=file.filename or "resume.pdf",
        parsed_data=parsed_data,
        ats_score=initial_score,
        status="analyzed",
        feedback=quality_result,
    )
    db.add(resume_record)
    db.commit()
    db.refresh(resume_record)

    return ResumeUploadResponse(
        id=resume_record.id,
        original_name=resume_record.original_name,
        status=resume_record.status,
        parsed_data=parsed_data,
        quality_score=initial_score,
        uploaded_at=resume_record.uploaded_at,
    )


@router.get("/list", response_model=List[ResumeListItem])
def list_user_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns list of all uploaded resumes for the current authenticated user.
    """
    resumes = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.uploaded_at.desc())
        .all()
    )
    return resumes


@router.get("/{resume_id}", response_model=ResumeDetailResponse)
def get_resume_detail(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve full parsed resume details, sections, and scores.
    """
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id, Resume.user_id == current_user.id)
        .first()
    )
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    return ResumeDetailResponse(
        id=resume.id,
        original_name=resume.original_name,
        status=resume.status,
        parsed_data=resume.parsed_data,
        ats_score=resume.ats_score,
        skill_gaps=resume.skill_gaps or [],
        feedback=resume.feedback,
        uploaded_at=resume.uploaded_at,
    )


@router.delete("/{resume_id}")
def delete_resume(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete a resume record and remove file from disk.
    """
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id, Resume.user_id == current_user.id)
        .first()
    )
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    # Delete file if exists
    StorageService.delete_file(resume.file_url)

    db.delete(resume)
    db.commit()

    return {"message": "Resume deleted successfully", "id": str(resume_id)}


@router.post("/ats-score", response_model=ATSScoreResponse)
async def score_resume_ats(
    request: ATSScoreRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Score a resume against a target job description.
    Updates resume record with ATS score, keyword gaps, and section feedback.
    """
    resume = (
        db.query(Resume)
        .filter(Resume.id == request.resume_id, Resume.user_id == current_user.id)
        .first()
    )
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    # Extract text from parsed data
    parsed_data = resume.parsed_data or {}
    raw_text = parsed_data.get("raw_text", "")
    sections = parsed_data.get("sections", {})

    if not raw_text:
        # Fallback if raw text wasn't cached
        full_path = StorageService.get_file_path(resume.file_url)
        reparsed = await resume_agent.parse_resume(full_path)
        raw_text = reparsed.get("raw_text", "")
        sections = reparsed.get("sections", {})

    if not raw_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume contains no readable text to analyze.",
        )

    # Run ATS Agent
    ats_result = await ats_agent.score_resume(
        resume_text=raw_text,
        job_description=request.job_description,
        resume_sections=sections,
    )

    # Convert missing keywords to schema shape
    missing_items = [
        KeywordGap(keyword=m["keyword"], importance=m.get("importance", "medium"))
        for m in ats_result.get("missing_keywords", [])
    ]

    section_feedback_items = [
        SectionFeedback(
            section=sf.get("section", ""),
            score=sf.get("score", 0.0),
            feedback=sf.get("feedback", ""),
            missing_keywords=sf.get("missing_keywords", []),
        )
        for sf in ats_result.get("section_feedback", [])
    ]

    # Update resume in DB
    resume.ats_score = ats_result.get("ats_score", 0.0)
    resume.skill_gaps = [m["keyword"] for m in ats_result.get("missing_keywords", [])]
    resume.feedback = {
        "summary": ats_result.get("summary", ""),
        "section_feedback": ats_result.get("section_feedback", []),
        "matched_count": len(ats_result.get("matched_keywords", [])),
        "missing_count": len(missing_items),
    }
    resume.status = "optimized"
    db.commit()

    return ATSScoreResponse(
        resume_id=resume.id,
        ats_score=resume.ats_score,
        matched_keywords=ats_result.get("matched_keywords", []),
        missing_keywords=missing_items,
        section_feedback=section_feedback_items,
        summary=ats_result.get("summary", ""),
    )
