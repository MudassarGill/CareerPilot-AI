"""
============================================================
CareerPilot AI — Learning Roadmap Agent
============================================================
Generates personalised learning roadmaps using RAG to find
relevant courses, tutorials, and documentation.

Process:
    1. Receive skill gaps from Skill Gap Agent
    2. RAG retrieval of learning resources
    3. LLM generates structured weekly/monthly plan
    4. Include: free & paid resources, estimated hours, milestones

TODO: Implement in Phase 2, Week 6
============================================================
"""


class RoadmapAgent:
    """Generates personalised learning roadmaps."""

    async def generate(self, skill_gaps: list, preferences: dict) -> dict:
        """Generate a structured learning roadmap."""
        # TODO: Implement roadmap generation with RAG
        return {"message": "Roadmap generation — coming in Phase 2"}
