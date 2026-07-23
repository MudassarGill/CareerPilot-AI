"""
============================================================
CareerPilot AI — Interview Agent
============================================================
Conducts AI-powered mock interviews with real-time feedback.

Modes:
    - Text mode:  Questions and answers via text
    - Voice mode: Whisper STT for speech, TTS for questions
    - Video mode: (Stretch goal) Camera + facial analysis

Process:
    1. Generate role-specific questions (LLM)
    2. Present questions to user
    3. Evaluate answer quality using scoring rubric
    4. Return per-question feedback and overall score

TODO: Implement in Phase 2, Week 7
============================================================
"""


class InterviewAgent:
    """Conducts AI mock interviews and evaluates answers."""

    async def generate_questions(self, role: str, count: int = 5) -> list:
        """Generate role-specific interview questions."""
        # TODO: Implement question generation
        return []

    async def evaluate_answer(self, question: str, answer: str) -> dict:
        """Evaluate a single answer against a scoring rubric."""
        # TODO: Implement answer evaluation
        return {"message": "Answer evaluation — coming in Phase 2"}
