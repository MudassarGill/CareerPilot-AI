"""
============================================================
CareerPilot AI — Skills Pydantic Schemas
============================================================
Request/response shapes for skill catalog, user skills CRUD,
and skill gap analysis endpoints.
============================================================
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from uuid import UUID


class SkillResponse(BaseModel):
    """A single skill from the catalog."""
    id: UUID
    name: str
    category: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class SkillCreate(BaseModel):
    """Request to add a skill to user's profile."""
    skill_id: UUID
    level: int = 0        # 0-100
    target_level: int = 0  # 0-100


class SkillUpdate(BaseModel):
    """Request to update user's skill level."""
    level: Optional[int] = None
    target_level: Optional[int] = None


class UserSkillResponse(BaseModel):
    """A user's skill with details."""
    id: UUID
    skill_id: UUID
    skill_name: str
    skill_category: Optional[str] = None
    level: int
    target_level: int

    model_config = ConfigDict(from_attributes=True)


class SkillGapItem(BaseModel):
    """A single skill gap entry."""
    skill_name: str
    category: Optional[str] = None
    required_level: int
    current_level: int
    gap: int
    status: str  # "missing" | "below_target" | "on_track" | "exceeded"


class SkillGapResponse(BaseModel):
    """Full skill gap analysis response."""
    target_role: str
    overall_match_pct: float
    total_required: int
    total_matched: int
    gaps: List[SkillGapItem] = []
