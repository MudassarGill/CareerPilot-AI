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


class InterviewSessionResponse(BaseModel):
    """Returned when a new session is started."""
    id: UUID
    role: str
    interview_type: str
    status: str
    total_questions: int
    questions: List[InterviewQuestion]
    conducted_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AnswerSubmitRequest(BaseModel):
    """Payload submitted for a single question response."""
    interview_id: UUID
    question_index: int
    answer_text: str
    duration_sec: Optional[int] = 0


class QuestionEvaluation(BaseModel):
    """Detailed AI rubric feedback for a single answer."""
    question_index: int
    score: float
    feedback: str
    matched_keywords: List[str]
    missing_keywords: List[str]
    clarity_score: float
    pacing_feedback: Optional[str] = None


class InterviewFinishResponse(BaseModel):
    """Final debrief and score after finishing an interview session."""
    id: UUID
    role: str
    overall_score: float
    status: str
    feedback_summary: str
    question_evaluations: List[Dict[str, Any]]
    new_crs_score: Optional[float] = None


class InterviewHistoryItem(BaseModel):
    """Summary item for past interview sessions."""
    id: UUID
    role: str
    interview_type: str
    status: str
    overall_score: Optional[float] = None
    questions_count: int = 0
    conducted_at: datetime

    model_config = ConfigDict(from_attributes=True)
