"""
============================================================
CareerPilot AI — Roadmap Pydantic Schemas
============================================================
Request and response data models for the Learning Roadmap
and weekly milestone completion system.
============================================================
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class LearningStepResource(BaseModel):
    """A recommended learning resource for a roadmap step."""
    title: str
    url: str
    type: str  # "docs" | "tutorial" | "course" | "practice"
    is_free: bool = True


class LearningStepSchema(BaseModel):
    """Schema for individual learning roadmap steps."""
    id: UUID
    roadmap_id: UUID
    title: str
    position: int
    status: str  # "pending" | "in_progress" | "done"
    milestone_name: Optional[str] = None
    estimated_hours: Optional[int] = None
    description: Optional[str] = None
    resources: Optional[List[LearningStepResource]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class LearningRoadmapSchema(BaseModel):
    """Schema for a complete personalized learning roadmap."""
    id: UUID
    user_id: UUID
    title: str
    target_role: Optional[str] = None
    progress_pct: float = 0.0
    total_steps: int = 0
    completed_steps: int = 0
    steps: List[LearningStepSchema] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class RoadmapGenerateRequest(BaseModel):
    """Request payload to generate or update a learning roadmap."""
    target_role: str
    target_timeline_months: Optional[int] = 3


class StepStatusUpdateRequest(BaseModel):
    """Request payload to toggle a step status."""
    status: str  # "pending" | "in_progress" | "done"


class StepUpdateResponse(BaseModel):
    """Response after updating a learning step status."""
    step: LearningStepSchema
    new_progress_pct: float
    total_steps: int
    completed_steps: int
    new_crs_score: Optional[float] = None
