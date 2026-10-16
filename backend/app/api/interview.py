"""
============================================================
CareerPilot AI — Interview API Routes (Phase 6)
============================================================
Handles AI mock interview sessions: question generation, answer
evaluation using multi-dimensional rubrics, finish debrief,
CRS readiness sync, and interview history.

Endpoints:
    POST /api/interview/start          → Start a new mock interview session
    POST /api/interview/answer         → Submit an answer and get AI rubric feedback
    POST /api/interview/{id}/finish    → Complete session, calculate score & update CRS
    GET  /api/interview/history        → List past interview sessions
    GET  /api/interview/{id}           → Get full details of a session
============================================================
"""

from typing import List, Dict, Any, Optional
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.database import get_db
from app.services.auth import get_current_user
from app.models.user import User
from app.models.interview import Interview
from app.models.notification import Notification
from app.agents.interview_agent import InterviewAgent
from app.services.readiness_service import calculate_readiness_score
from app.schemas.interview import (
    InterviewStartRequest,
    InterviewSessionResponse,
    AnswerSubmitRequest,
    QuestionEvaluation,
    InterviewFinishResponse,
    InterviewHistoryItem,
)

router = APIRouter()
interview_agent = InterviewAgent()


@router.post("/start", response_model=InterviewSessionResponse)
async def start_interview(
    payload: InterviewStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Start a new AI mock interview session for a specified role and difficulty.
    Generates questions and persists an in-progress session record.
    """
    try:
        # Generate questions using InterviewAgent
        questions_list = await interview_agent.generate_questions(
            role=payload.role,
            count=payload.question_count,
            difficulty=payload.difficulty,
        )

        # Create new interview record in database
        new_interview = Interview(
            user_id=current_user.id,
            role=payload.role,
            interview_type=payload.interview_type,
            status="in_progress",
            questions=questions_list,
            answers=[],
            feedback=[],
            overall_score=None,
            conducted_at=datetime.utcnow(),
        )
        db.add(new_interview)
        db.commit()
        db.refresh(new_interview)

        return {
            "id": new_interview.id,
            "role": new_interview.role,
            "interview_type": new_interview.interview_type,
            "status": new_interview.status,
            "total_questions": len(questions_list),
            "questions": questions_list,
            "conducted_at": new_interview.conducted_at,
        }
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to initialize mock interview: {str(exc)}",
        )


@router.post("/answer", response_model=QuestionEvaluation)
async def submit_answer(
    payload: AnswerSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Submit an answer to a specific question in an active interview session.
    Evaluates the response using technical keywords, depth, clarity, and pacing.
    """
    interview = (
        db.query(Interview)
        .filter(Interview.id == payload.interview_id, Interview.user_id == current_user.id)
        .first()
    )
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found.",
        )

    questions = interview.questions or []
    if payload.question_index < 0 or payload.question_index >= len(questions):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid question index for this interview session.",
        )

    current_question = questions[payload.question_index]

    # Evaluate answer via InterviewAgent
    evaluation = await interview_agent.evaluate_answer(
        question_dict=current_question,
        answer_text=payload.answer_text,
        duration_sec=payload.duration_sec or 0,
    )

    # Store user answer and evaluation in database lists
    answers_list = list(interview.answers or [])
    feedback_list = list(interview.feedback or [])

    answer_entry = {
        "question_index": payload.question_index,
        "answer_text": payload.answer_text,
        "duration_sec": payload.duration_sec or 0,
        "submitted_at": datetime.utcnow().isoformat(),
    }

    eval_entry = {
        "question_index": payload.question_index,
        "score": evaluation["score"],
        "feedback": evaluation["feedback"],
        "matched_keywords": evaluation["matched_keywords"],
        "missing_keywords": evaluation["missing_keywords"],
        "clarity_score": evaluation["clarity_score"],
        "pacing_feedback": evaluation["pacing_feedback"],
    }

    # If updating an existing index, replace; otherwise append
    replaced_ans = False
    for idx, ans in enumerate(answers_list):
        if ans.get("question_index") == payload.question_index:
            answers_list[idx] = answer_entry
            replaced_ans = True
            break
    if not replaced_ans:
        answers_list.append(answer_entry)

    replaced_fb = False
    for idx, fb in enumerate(feedback_list):
        if fb.get("question_index") == payload.question_index:
            feedback_list[idx] = eval_entry
            replaced_fb = True
            break
    if not replaced_fb:
        feedback_list.append(eval_entry)

    interview.answers = answers_list
    interview.feedback = feedback_list
    db.commit()

    return {
        "question_index": payload.question_index,
        "score": evaluation["score"],
        "feedback": evaluation["feedback"],
        "matched_keywords": evaluation["matched_keywords"],
        "missing_keywords": evaluation["missing_keywords"],
        "clarity_score": evaluation["clarity_score"],
        "pacing_feedback": evaluation["pacing_feedback"],
    }


@router.post("/{interview_id}/finish", response_model=InterviewFinishResponse)
async def finish_interview(
    interview_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Finalize an interview session, aggregate performance scores,
    update user Career Readiness Score (CRS), and generate debrief summary.
    """
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id, Interview.user_id == current_user.id)
        .first()
    )
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found.",
        )

    feedback_list = interview.feedback or []
    if feedback_list:
        scores = [item.get("score", 0.0) for item in feedback_list]
        overall_score = round(sum(scores) / len(scores), 1)
    else:
        overall_score = 0.0

    interview.status = "completed"
    interview.overall_score = overall_score
    db.commit()

    # Re-calculate Career Readiness Score with new interview score
    new_crs_score = None
    try:
        updated_crs = calculate_readiness_score(db, str(current_user.id))
        if updated_crs:
            new_crs_score = updated_crs.score
    except Exception as exc:
        print(f"[WARN] Error updating CRS after interview: {exc}")

    # Generate debrief summary text
    if overall_score >= 80:
        summary_text = (
            f"Outstanding performance across {interview.role} competencies! "
            f"You demonstrated deep domain mastery, strong architectural clarity, and precise technical vocabulary."
        )
    elif overall_score >= 60:
        summary_text = (
            f"Solid baseline interview performance for {interview.role}. "
            f"Review missed technical concepts and expand your answers with concrete implementation trade-offs."
        )
    else:
        summary_text = (
            f"Opportunities identified in your {interview.role} interview. "
            f"Focus on structured problem solving, core technical terminology, and practicing conversational depth."
        )

    # Post an in-app notification
    try:
        notification = Notification(
            user_id=current_user.id,
            title="Interview Completed",
            message=f"You completed the {interview.role} mock interview with a score of {overall_score}%.",
            type="interview",
            read=False,
        )
        db.add(notification)
        db.commit()
    except Exception as exc:
        print(f"[WARN] Could not create interview completion notification: {exc}")

    return {
        "id": interview.id,
        "role": interview.role,
        "overall_score": overall_score,
        "status": interview.status,
        "feedback_summary": summary_text,
        "question_evaluations": feedback_list,
        "new_crs_score": new_crs_score,
    }


@router.get("/history", response_model=List[InterviewHistoryItem])
async def get_interview_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get all past interview sessions for the current authenticated user.
    """
    interviews = (
        db.query(Interview)
        .filter(Interview.user_id == current_user.id)
        .order_by(desc(Interview.conducted_at))
        .all()
    )

    results = []
    for item in interviews:
        questions_count = len(item.questions) if item.questions else 0
        results.append(
            InterviewHistoryItem(
                id=item.id,
                role=item.role,
                interview_type=item.interview_type or "text",
                status=item.status or "completed",
                overall_score=item.overall_score,
                questions_count=questions_count,
                conducted_at=item.conducted_at,
            )
        )
    return results


@router.get("/{interview_id}")
async def get_interview_detail(
    interview_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get complete details of a specific mock interview session.
    """
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id, Interview.user_id == current_user.id)
        .first()
    )
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found.",
        )

    return {
        "id": interview.id,
        "role": interview.role,
        "interview_type": interview.interview_type,
        "status": interview.status,
        "questions": interview.questions or [],
        "answers": interview.answers or [],
        "feedback": interview.feedback or [],
        "overall_score": interview.overall_score,
        "conducted_at": interview.conducted_at,
    }
