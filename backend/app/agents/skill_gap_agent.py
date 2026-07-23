"""
============================================================
CareerPilot AI — Skill Gap Agent
============================================================
Identifies missing skills by comparing the user's current
skill set against target role requirements.

Process:
    1. Get user's skills from profile/resume
    2. Retrieve target role requirements via RAG
    3. Compare and categorise: Strong / Adequate / Weak / Missing
    4. Generate priority-ranked skill gap list

TODO: Implement in Phase 2, Week 5
============================================================
"""


class SkillGapAgent:
    """Identifies skill gaps between user profile and target role."""

    async def analyse_gaps(self, user_skills: list, target_role: str) -> dict:
        """Compare user skills against role requirements."""
        # TODO: Implement skill gap analysis
        return {"message": "Skill gap analysis — coming in Phase 2"}
