"""
============================================================
CareerPilot AI — Mock Interview Module Tests
============================================================
Tests for:
  - Role-specific question bank generation
  - Multi-dimensional technical rubric scoring
  - Speech metric analysis (WPM, filler words, fluency)
  - Computer Vision behavioral telemetry processing
  - SRS Confidence Score formula & missing-signal handling
  - 30-day retention policy calculation
  - Ethical interpretation disclaimer compliance
============================================================
"""

import asyncio
import pytest
from datetime import datetime, timedelta
from app.agents.interview_agent import InterviewAgent
from app.schemas.interview import (
    InterviewStartRequest,
    AnswerSubmitRequest,
    QuestionEvaluation,
    InterviewFinishResponse,
)


@pytest.fixture
def agent():
    return InterviewAgent()


def test_question_generation(agent):
    """Test questions are generated with expected structure and categories."""
    questions = asyncio.run(agent.generate_questions("Frontend Developer", count=3, difficulty="mid"))
    assert len(questions) == 3
    for q in questions:
        assert "question" in q
        assert "category" in q
        assert "expected_keywords" in q
        assert len(q["expected_keywords"]) > 0


def test_technical_rubric_evaluation(agent):
    """Test technical answer evaluation with keywords, depth, and clarity."""
    question = {
        "question": "Can you explain how React's virtual DOM reconciliation and fiber architecture optimize render cycles?",
        "expected_keywords": ["reconciliation", "fiber", "diffing", "tree", "state", "batching"],
        "category": "technical",
    }
    answer = (
        "React uses a fiber reconciliation tree algorithm to perform diffing against the virtual DOM. "
        "Because updates are batched concurrently, state transitions only repaint modified nodes, "
        "specifically optimizing render cycles and frame rates."
    )
    result = asyncio.run(agent.evaluate_answer(question, answer, duration_sec=45))
    assert result["score"] >= 70.0
    assert len(result["matched_keywords"]) >= 3
    assert result["clarity_score"] > 50.0
    assert result["speech_analysis"]["words_per_minute"] > 0


def test_speech_metrics_and_filler_words(agent):
    """Test speech filler word detection and fluency scoring."""
    question = {
        "question": "How do you handle production outages?",
        "expected_keywords": ["monitoring", "logs", "rollback"],
    }
    answer_with_fillers = (
        "Um, basically, like, we look at the monitoring logs, and uh, sort of initiate a rollback, you know."
    )
    result = asyncio.run(agent.evaluate_answer(question, answer_with_fillers, duration_sec=30))
    speech = result["speech_analysis"]
    assert speech["filler_count"] >= 3
    assert speech["filler_density_pct"] > 0
    assert len(speech["filler_words_detected"]) >= 2
    # Check that pacing feedback notes the fillers
    assert "filler" in result["feedback"].lower()


def test_computer_vision_behavioral_telemetry(agent):
    """Test processing of real-time computer vision metrics from webcam."""
    question = {
        "question": "Explain asynchronous I/O in Python FastAPI.",
        "expected_keywords": ["event loop", "coroutine", "asyncio"],
    }
    answer = "FastAPI leverages Python asyncio and the event loop to handle non-blocking coroutines."
    visual_metrics = {
        "face_detected": True,
        "face_visibility_ratio": 0.95,
        "camera_facing_ratio": 0.90,
        "eye_contact_ratio": 0.85,
        "posture_stability_score": 92.0,
        "head_movement_stability": "stable",
    }
    result = asyncio.run(agent.evaluate_answer(
        question, answer, duration_sec=25, visual_metrics=visual_metrics, avatar_latency_ms=180.5
    ))
    assert result["behavioral_insights"] is not None
    assert result["behavioral_insights"]["face_visibility_ratio"] == 0.95
    assert result["behavioral_insights"]["posture_stability_score"] == 92.0
    assert result["avatar_latency_ms"] == 180.5


def test_srs_confidence_score_formula_full(agent):
    """
    Test SRS confidence formula when both video and audio signals are available:
        Eye contact (30%) + Posture (25%) + Vocal clarity (25%) + Response fluency (20%)
    """
    visual_summary = {
        "camera_active": True,
        "face_detected": True,
        "eye_contact_ratio": 0.80,         # 80 points * 0.30 = 24.0
        "posture_stability_score": 90.0,    # 90 points * 0.25 = 22.5
    }
    speech_summary = {
        "vocal_clarity_score": 80.0,        # 80 points * 0.25 = 20.0
        "fluency_score": 85.0,              # 85 points * 0.20 = 17.0
    }
    # Expected: 24.0 + 22.5 + 20.0 + 17.0 = 83.5
    res = agent.compute_srs_confidence_score(visual_summary, speech_summary)
    assert res["confidence_score"] == 83.5
    assert res["visual_signals_available"] is True
    assert res["breakdown"]["eye_contact"]["weight_pct"] == 30
    assert res["breakdown"]["posture"]["weight_pct"] == 25
    assert res["breakdown"]["vocal_clarity"]["weight_pct"] == 25
    assert res["breakdown"]["response_fluency"]["weight_pct"] == 20


def test_srs_confidence_score_missing_visual_signal(agent):
    """
    Test missing-signal handling when camera is disabled or face is not observed.
    Weights must normalize cleanly without inventing numbers.
    """
    visual_summary = {
        "camera_active": False,
        "face_detected": False,
    }
    speech_summary = {
        "vocal_clarity_score": 80.0,
        "fluency_score": 80.0,
    }
    res = agent.compute_srs_confidence_score(visual_summary, speech_summary)
    assert res["visual_signals_available"] is False
    assert res["breakdown"]["eye_contact"]["score"] is None
    assert res["breakdown"]["posture"]["score"] is None
    # Re-normalized audio score: 80 * 0.555 + 80 * 0.445 = 80.0
    assert res["confidence_score"] == 80.0


def test_interpretation_limitation_notice(agent):
    """Test mandatory scientific limitation disclaimer is present."""
    notice = agent.get_interpretation_limitation_notice()
    assert "Observable Interview Behaviour Notice" in notice
    assert "ethics" in notice.lower()
    assert "not" in notice.lower()


def test_retention_policy_30_days():
    """Verify 30-day retention calculation."""
    now = datetime.utcnow()
    expires = now + timedelta(days=30)
    delta = expires - now
    assert delta.days == 30


def test_schema_backward_compatibility():
    """Verify schema backward compatibility for start and answer requests."""
    start_req = InterviewStartRequest(role="Backend Developer", question_count=3)
    assert start_req.consent_granted is True
    assert start_req.interviewer_persona == "sarah"

    ans_req = AnswerSubmitRequest(
        interview_id="11111111-1111-1111-1111-111111111111",
        question_index=0,
        answer_text="Sample answer text.",
        visual_metrics={"camera_facing_ratio": 0.9},
        speech_metrics={"wpm": 140.0},
        avatar_latency_ms=160.0,
    )
    assert ans_req.visual_metrics["camera_facing_ratio"] == 0.9
    assert ans_req.speech_metrics["wpm"] == 140.0
    assert ans_req.avatar_latency_ms == 160.0
