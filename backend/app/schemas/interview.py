"""
============================================================
CareerPilot AI — Interview Pydantic Schemas (Phase 6)
============================================================
Request and response models for AI Mock Interview sessions,
question generation, real-time evaluation, and history.
============================================================
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class InterviewQuestion(BaseModel):
    """A generated or retrieved interview question."""
    id: str
    question: str
    category: str  # "technical" | "behavioral" | "system_design"
    difficulty: str  # "junior" | "mid" | "senior"
    hint: Optional[str] = None


class InterviewStartRequest(BaseModel):
    """Payload to start a mock interview session."""
    role: str = "Frontend Developer"
    interview_type: str = "text"  # "text" | "audio" | "video"
    question_count: int = 5
    difficulty: str = "mid"
    consent_granted: Optional[bool] = True
    interviewer_persona: Optional[str] = "sarah"


class InterviewSessionResponse(BaseModel):
    """Returned when a new session is started."""
    id: UUID
    role: str
    interview_type: str
    status: str
    total_questions: int
    questions: List[InterviewQuestion]
    conducted_at: datetime
    consent_granted: Optional[bool] = True
    interviewer_persona: Optional[str] = "sarah"
    expires_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class AnswerSubmitRequest(BaseModel):
    """Payload submitted for a single question response."""
    interview_id: UUID
    question_index: int
    answer_text: str
    duration_sec: Optional[int] = 0
    visual_metrics: Optional[Dict[str, Any]] = None  # CV metrics: face visibility, gaze, pose, posture
    speech_metrics: Optional[Dict[str, Any]] = None  # Speech metrics: filler words, wpm, fluency
    avatar_latency_ms: Optional[float] = None        # PER-04 latency measurement


class QuestionEvaluation(BaseModel):
    """Detailed AI rubric feedback for a single answer."""
    question_index: int
    score: float
    feedback: str
    matched_keywords: List[str]
    missing_keywords: List[str]
    clarity_score: float
    pacing_feedback: Optional[str] = None
    behavioral_insights: Optional[Dict[str, Any]] = None
    speech_analysis: Optional[Dict[str, Any]] = None
    avatar_latency_ms: Optional[float] = None


class InterviewFinishResponse(BaseModel):
    """Final debrief and score after finishing an interview session."""
    id: UUID
    role: str
    overall_score: float                              # Technical content rubric score (0-100)
    confidence_score: Optional[float] = None          # SRS confidence score (0-100)
    confidence_breakdown: Optional[Dict[str, Any]] = None  # Eye contact 30%, Posture 25%, Vocal clarity 25%, Response fluency 20%
    behavioral_summary: Optional[Dict[str, Any]] = None    # Observable CV and presentation indicators
    speech_summary: Optional[Dict[str, Any]] = None        # Aggregated speech pacing and filler word statistics
    interpretation_limitation: Optional[str] = None        # Mandatory scientific disclaimer
    status: str
    feedback_summary: str
    question_evaluations: List[Dict[str, Any]]
    new_crs_score: Optional[float] = None
    avatar_latency_ms: Optional[float] = None
    expires_at: Optional[datetime] = None


class InterviewHistoryItem(BaseModel):
    """Summary item for past interview sessions."""
    id: UUID
    role: str
    interview_type: str
    status: str
    overall_score: Optional[float] = None
    confidence_score: Optional[float] = None
    questions_count: int = 0
    conducted_at: datetime
    expires_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
