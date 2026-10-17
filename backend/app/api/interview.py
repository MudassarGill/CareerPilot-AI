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
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.database import get_db
from app.services.auth import get_current_user
from app.models.user import User
from app.models.interview import Interview
from app.models.notification import Notification
from app.models.consent_records import ConsentRecord
from app.agents.interview_agent import InterviewAgent
from app.services.readiness_service import calculate_readiness_score
from app.schemas.interview import (
    InterviewStartRequest,
    InterviewSessionResponse,
    AnswerSubmitRequest,
    QuestionEvaluation,
    InterviewFinishResponse,
    InterviewHistoryItem,
    InterviewConversationRequest,
    InterviewConversationResponse,
)

router = APIRouter()
interview_agent = InterviewAgent()


@router.post("/converse", response_model=InterviewConversationResponse)
async def converse_with_avatar(
    payload: InterviewConversationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Real-time conversational dialogue with the AI avatar (warm-up,
    self-introductions, chit-chat, Q&A, and bilingual Urdu/English interaction).
    """
    try:
        candidate_name = payload.candidate_name or getattr(current_user, "name", None)
        return interview_agent.handle_interview_conversation(
            message=payload.message,
            persona=payload.persona,
            role=payload.role,
            dialogue_state=payload.dialogue_state,
            candidate_name=candidate_name,
            language=payload.language,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Conversational error: {str(exc)}",
        )


@router.post("/start", response_model=InterviewSessionResponse)
async def start_interview(
    payload: InterviewStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Start a new AI mock interview session for a specified role and difficulty.
    Generates questions, persists in-progress session, sets 30-day retention,
    and logs explicit recording consent.
    """
    try:
        # Generate questions using InterviewAgent
        questions_list = await interview_agent.generate_questions(
            role=payload.role,
            count=payload.question_count,
            difficulty=payload.difficulty,
        )

        now = datetime.utcnow()
        retention_expiry = now + timedelta(days=30)  # SRS 30-day retention limit

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
            confidence_score=None,
            behavioral_metrics=None,
            avatar_latency_ms=None,
            consent_granted=payload.consent_granted if payload.consent_granted is not None else True,
            conducted_at=now,
            expires_at=retention_expiry,
        )
        db.add(new_interview)

        # Record consent in audit table if granted
        if payload.consent_granted:
            try:
                consent_entry = ConsentRecord(
                    user_id=current_user.id,
                    type="interview_media_recording",
                    granted=True,
                    granted_at=now,
                )
                db.add(consent_entry)
            except Exception as c_err:
                print(f"[INFO] Notice recording consent audit: {c_err}")

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
            "consent_granted": new_interview.consent_granted,
            "interviewer_persona": payload.interviewer_persona or "sarah",
            "expires_at": new_interview.expires_at,
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
    Evaluates the response using technical keywords, depth, clarity, and pacing,
    plus computer vision behavioral metrics and speech metrics when available.
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

    # Evaluate answer via InterviewAgent with CV & speech metrics
    evaluation = await interview_agent.evaluate_answer(
        question_dict=current_question,
        answer_text=payload.answer_text,
        duration_sec=payload.duration_sec or 0,
        visual_metrics=payload.visual_metrics,
        speech_metrics=payload.speech_metrics,
        avatar_latency_ms=payload.avatar_latency_ms,
    )

    # Store user answer and evaluation in database lists
    answers_list = list(interview.answers or [])
    feedback_list = list(interview.feedback or [])

    answer_entry = {
        "question_index": payload.question_index,
        "answer_text": payload.answer_text,
        "duration_sec": payload.duration_sec or 0,
        "visual_metrics": payload.visual_metrics,
        "speech_metrics": payload.speech_metrics,
        "avatar_latency_ms": payload.avatar_latency_ms,
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
        "behavioral_insights": evaluation.get("behavioral_insights"),
        "speech_analysis": evaluation.get("speech_analysis"),
        "avatar_latency_ms": payload.avatar_latency_ms,
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
        "behavioral_insights": evaluation.get("behavioral_insights"),
        "speech_analysis": evaluation.get("speech_analysis"),
        "avatar_latency_ms": payload.avatar_latency_ms,
    }


@router.post("/{interview_id}/finish", response_model=InterviewFinishResponse)
async def finish_interview(
    interview_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Finalize an interview session, aggregate performance scores,
    compute SRS Confidence Score formula (Eye Contact 30%, Posture 25%,
    Vocal Clarity 25%, Response Fluency 20%), update Career Readiness Score (CRS),
    and generate debrief summary with scientific interpretation limits.
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
    answers_list = interview.answers or []

    # 1. Technical overall score (rubric-based 0-100)
    if feedback_list:
        scores = [item.get("score", 0.0) for item in feedback_list]
        overall_score = round(sum(scores) / len(scores), 1)
        clarity_scores = [item.get("clarity_score", 70.0) for item in feedback_list]
        avg_clarity = sum(clarity_scores) / len(clarity_scores)
    else:
        overall_score = 0.0
        avg_clarity = 70.0

    # 2. Aggregate visual telemetry across all answers
    all_vis = [a.get("visual_metrics") for a in answers_list if a.get("visual_metrics")]
    if all_vis:
        face_detected = any(v.get("face_detected", True) for v in all_vis)
        avg_face_vis = round(sum(v.get("face_visibility_ratio", 1.0) for v in all_vis) / len(all_vis), 2)
        avg_cam_facing = round(sum(v.get("camera_facing_ratio", 0.85) for v in all_vis) / len(all_vis), 2)
        avg_eye_contact = round(sum(v.get("eye_contact_ratio", 0.80) for v in all_vis) / len(all_vis), 2)
        avg_posture = round(sum(v.get("posture_stability_score", 85.0) for v in all_vis) / len(all_vis), 1)

        visual_summary = {
            "camera_active": True,
            "face_detected": face_detected,
            "face_visibility_ratio": avg_face_vis,
            "camera_facing_ratio": avg_cam_facing,
            "eye_contact_ratio": avg_eye_contact,
            "posture_stability_score": avg_posture,
            "observations_count": len(all_vis),
        }
    else:
        visual_summary = {
            "camera_active": interview.interview_type == "video",
            "face_detected": False,
            "face_visibility_ratio": 0.0,
            "camera_facing_ratio": 0.0,
            "eye_contact_ratio": 0.0,
            "posture_stability_score": 0.0,
            "observations_count": 0,
        }

    # 3. Aggregate speech telemetry across all answers
    all_speech = [a.get("speech_metrics") for a in answers_list if a.get("speech_metrics")]
    if all_speech:
        avg_wpm = round(sum(s.get("wpm", 0.0) for s in all_speech) / len(all_speech), 1)
        total_fillers = sum(s.get("filler_count", 0) for s in all_speech)
        avg_fluency = round(sum(s.get("fluency_score", 75.0) for s in all_speech) / len(all_speech), 1)
        speech_summary = {
            "average_wpm": avg_wpm,
            "total_filler_words": total_fillers,
            "fluency_score": avg_fluency,
            "vocal_clarity_score": round(avg_clarity, 1),
        }
    else:
        speech_summary = {
            "average_wpm": 0.0,
            "total_filler_words": 0,
            "fluency_score": round(avg_clarity, 1),
            "vocal_clarity_score": round(avg_clarity, 1),
        }

    # 4. Compute SRS Confidence Score (Eye Contact 30%, Posture 25%, Vocal Clarity 25%, Response Fluency 20%)
    srs_result = interview_agent.compute_srs_confidence_score(
        visual_summary=visual_summary,
        speech_summary=speech_summary,
        avg_clarity_score=avg_clarity,
    )
    confidence_score = srs_result["confidence_score"]
    confidence_breakdown = srs_result["breakdown"]

    # 5. Average Avatar Response Latency (PER-04)
    latencies = [a.get("avatar_latency_ms") for a in answers_list if a.get("avatar_latency_ms") is not None]
    avg_latency = round(sum(latencies) / len(latencies), 1) if latencies else 185.0

    # Ensure 30-day retention timestamp
    now = datetime.utcnow()
    if not interview.expires_at:
        interview.expires_at = now + timedelta(days=30)

    interview.status = "completed"
    interview.overall_score = overall_score
    interview.confidence_score = confidence_score
    interview.avatar_latency_ms = avg_latency
    interview.behavioral_metrics = {
        "visual_summary": visual_summary,
        "speech_summary": speech_summary,
        "confidence_breakdown": confidence_breakdown,
        "formula_applied": srs_result["formula_applied"],
    }
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
            message=f"You completed the {interview.role} mock interview with a technical score of {overall_score}% and presentation confidence of {confidence_score}%.",
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
        "confidence_score": confidence_score,
        "confidence_breakdown": confidence_breakdown,
        "behavioral_summary": visual_summary,
        "speech_summary": speech_summary,
        "interpretation_limitation": interview_agent.get_interpretation_limitation_notice(),
        "status": interview.status,
        "feedback_summary": summary_text,
        "question_evaluations": feedback_list,
        "new_crs_score": new_crs_score,
        "avatar_latency_ms": avg_latency,
        "expires_at": interview.expires_at,
    }


@router.get("/history", response_model=List[InterviewHistoryItem])
async def get_interview_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get all past interview sessions for the current authenticated user,
    including technical scores, SRS confidence scores, and retention status.
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
                confidence_score=item.confidence_score,
                questions_count=questions_count,
                conducted_at=item.conducted_at,
                expires_at=item.expires_at,
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
    Get complete details of a specific mock interview session, including
    technical Q&A, AI rubric feedback, behavioral metrics, and SRS confidence score.
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
        "confidence_score": interview.confidence_score,
        "behavioral_metrics": interview.behavioral_metrics or {},
        "avatar_latency_ms": interview.avatar_latency_ms,
        "consent_granted": interview.consent_granted,
        "conducted_at": interview.conducted_at,
        "expires_at": interview.expires_at,
        "interpretation_limitation": interview_agent.get_interpretation_limitation_notice(),
    }
