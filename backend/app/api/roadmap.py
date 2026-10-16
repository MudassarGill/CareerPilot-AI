"""
============================================================
CareerPilot AI — Learning Roadmap API Routes (Phase 5)
============================================================
Provides personalized learning roadmaps based on target roles
and skill gaps. Supports milestone progression and weekly step
completion tracking that directly updates Career Readiness Scores.

Endpoints:
    GET    /api/roadmap/current        → Get user's active roadmap with steps
    POST   /api/roadmap/generate       → Generate/regenerate tailored roadmap
    PATCH  /api/roadmap/steps/{step_id}→ Toggle step status (pending/in_progress/done)
    DELETE /api/roadmap/{roadmap_id}   → Delete roadmap
============================================================
"""

from typing import Optional, List, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.database import get_db
from app.services.auth import get_current_user
from app.models.user import User
from app.models.learning import LearningRoadmap, LearningStep
from app.models.career_profile import CareerProfile
from app.agents.roadmap_agent import RoadmapAgent, ROLE_ROADMAP_TEMPLATES
from app.agents.skill_gap_agent import SkillGapAgent
from app.services.readiness_service import calculate_readiness_score
from app.schemas.roadmap import (
    LearningStepResource,
    LearningStepSchema,
    LearningRoadmapSchema,
    RoadmapGenerateRequest,
    StepStatusUpdateRequest,
    StepUpdateResponse,
)

router = APIRouter()
roadmap_agent = RoadmapAgent()
skill_gap_agent = SkillGapAgent()


def _format_roadmap_response(
    roadmap: LearningRoadmap, steps: List[LearningStep]
) -> LearningRoadmapSchema:
    total = len(steps)
    completed = sum(1 for s in steps if s.status == "done")
    pct = round((completed / total) * 100.0, 1) if total > 0 else 0.0

    # Look up step enrichment data from template if available
    role_key = roadmap.target_role or "Frontend Developer"
    template_list = ROLE_ROADMAP_TEMPLATES.get(
        role_key, ROLE_ROADMAP_TEMPLATES["Frontend Developer"]
    )

    step_schemas = []
    for s in steps:
        meta = None
        # match by position or title
        for t in template_list:
            if t["title"].lower() in s.title.lower() or s.title.lower() in t["title"].lower():
                meta = t
                break
        if not meta and 0 <= s.position - 1 < len(template_list):
            meta = template_list[s.position - 1]

        res_list = []
        if meta and "resources" in meta:
            res_list = [
                LearningStepResource(
                    title=r["title"],
                    url=r["url"],
                    type=r.get("type", "docs"),
                    is_free=r.get("is_free", True),
                )
                for r in meta["resources"]
            ]

        step_schemas.append(
            LearningStepSchema(
                id=s.id,
                roadmap_id=s.roadmap_id,
                title=s.title,
                position=s.position,
                status=s.status,
                milestone_name=meta.get("milestone") if meta else f"Milestone Step {s.position}",
                estimated_hours=meta.get("estimated_hours", 12) if meta else 10,
                description=meta.get("description", "Complete practical exercises and build portfolio competencies.") if meta else "",
                resources=res_list,
                created_at=s.created_at,
                updated_at=s.updated_at,
            )
        )

    return LearningRoadmapSchema(
        id=roadmap.id,
        user_id=roadmap.user_id,
        title=roadmap.title,
        target_role=roadmap.target_role,
        progress_pct=pct,
        total_steps=total,
        completed_steps=completed,
        steps=step_schemas,
        created_at=roadmap.created_at,
        updated_at=roadmap.updated_at,
    )


@router.get("/current", response_model=Optional[LearningRoadmapSchema])
async def get_current_roadmap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve the current user's active learning roadmap.
    If none exists, auto-generates a default roadmap for their target role.
    """
    roadmap = (
        db.query(LearningRoadmap)
        .filter(LearningRoadmap.user_id == current_user.id)
        .order_by(LearningRoadmap.created_at.desc())
        .first()
    )

    if not roadmap:
        # Check target role from profile or default
        profile = (
            db.query(CareerProfile)
            .filter(CareerProfile.user_id == current_user.id)
            .first()
        )
        target_role = (profile.target_role if profile and profile.target_role else "Frontend Developer")
        
        # Auto-generate initial roadmap
        generated = await roadmap_agent.generate(target_role=target_role)
        roadmap = LearningRoadmap(
            user_id=current_user.id,
            title=generated["title"],
            target_role=generated["target_role"],
        )
        db.add(roadmap)
        db.commit()
        db.refresh(roadmap)

        for step_data in generated["steps"]:
            db.add(
                LearningStep(
                    roadmap_id=roadmap.id,
                    title=step_data["title"],
                    position=step_data["position"],
                    status="pending",
                )
            )
        db.commit()

    steps = (
        db.query(LearningStep)
        .filter(LearningStep.roadmap_id == roadmap.id)
        .order_by(LearningStep.position.asc())
        .all()
    )

    return _format_roadmap_response(roadmap, steps)


@router.post("/generate", response_model=LearningRoadmapSchema)
async def generate_roadmap(
    payload: RoadmapGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Generates a new personalized roadmap for the user based on target role
    and identified skill gaps. Replaces previous active roadmaps.
    """
    # 1. Fetch user's skill gaps for this target role
    missing_skills = []
    try:
        from app.models.skill import Skill, UserSkill
        user_skills = (
            db.query(Skill.name)
            .join(UserSkill, UserSkill.skill_id == Skill.id)
            .filter(UserSkill.user_id == current_user.id)
            .all()
        )
        candidate_skills = [s[0] for s in user_skills]
        gap_analysis = await skill_gap_agent.analyze_gap(
            target_role=payload.target_role,
            user_skills=candidate_skills,
        )
        missing_skills = [
            g["skill_name"] for g in gap_analysis.get("gaps", []) if g.get("status") in ("missing", "below_target")
        ]
    except Exception:
        missing_skills = []

    # 2. Run RoadmapAgent
    generated = await roadmap_agent.generate(
        target_role=payload.target_role,
        skill_gaps=missing_skills,
    )

    # 3. Clean up existing roadmaps for fresh plan
    existing = (
        db.query(LearningRoadmap)
        .filter(LearningRoadmap.user_id == current_user.id)
        .all()
    )
    for r in existing:
        db.delete(r)
    db.commit()

    # 4. Save new LearningRoadmap
    new_roadmap = LearningRoadmap(
        user_id=current_user.id,
        title=generated["title"],
        target_role=generated["target_role"],
    )
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)

    # 5. Insert LearningSteps
    created_steps = []
    for s in generated["steps"]:
        step_rec = LearningStep(
            roadmap_id=new_roadmap.id,
            title=s["title"],
            position=s["position"],
            status="pending",
        )
        db.add(step_rec)
        created_steps.append(step_rec)
    db.commit()

    for s in created_steps:
        db.refresh(s)

    # 6. Update CareerProfile
    profile = (
        db.query(CareerProfile)
        .filter(CareerProfile.user_id == current_user.id)
        .first()
    )
    if profile:
        profile.target_role = payload.target_role
        profile.roadmap = generated
        db.commit()

    # 7. Recalculate CRS
    calculate_readiness_score(db, str(current_user.id))

    return _format_roadmap_response(new_roadmap, created_steps)


@router.patch("/steps/{step_id}", response_model=StepUpdateResponse)
def update_step_status(
    step_id: UUID,
    payload: StepStatusUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Toggle step status ('pending', 'in_progress', 'done').
    Automatically updates the user's Career Readiness Score (CRS) learning metric!
    """
    valid_statuses = {"pending", "in_progress", "done"}
    if payload.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{payload.status}'. Must be one of {valid_statuses}",
        )

    # Verify ownership through roadmap
    step = (
        db.query(LearningStep)
        .join(LearningRoadmap, LearningStep.roadmap_id == LearningRoadmap.id)
        .filter(LearningStep.id == step_id, LearningRoadmap.user_id == current_user.id)
        .first()
    )
    if not step:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learning step not found",
        )

    step.status = payload.status
    db.commit()
    db.refresh(step)

    # Calculate new progress
    steps = (
        db.query(LearningStep)
        .filter(LearningStep.roadmap_id == step.roadmap_id)
        .all()
    )
    total = len(steps)
    completed = sum(1 for s in steps if s.status == "done")
    pct = round((completed / total) * 100.0, 1) if total > 0 else 0.0

    # Recalculate CRS score
    updated_crs = calculate_readiness_score(db, str(current_user.id))

    # Retrieve step schema representation
    roadmap = db.query(LearningRoadmap).filter(LearningRoadmap.id == step.roadmap_id).first()
    formatted = _format_roadmap_response(roadmap, steps)
    target_schema = next((s for s in formatted.steps if s.id == step.id), None)

    if not target_schema:
        target_schema = LearningStepSchema(
            id=step.id,
            roadmap_id=step.roadmap_id,
            title=step.title,
            position=step.position,
            status=step.status,
            milestone_name="Milestone Step",
            estimated_hours=12,
            description="Complete practical competencies.",
            resources=[],
            created_at=step.created_at,
            updated_at=step.updated_at,
        )

    return StepUpdateResponse(
        step=target_schema,
        new_progress_pct=pct,
        total_steps=total,
        completed_steps=completed,
        new_crs_score=updated_crs.score if updated_crs else None,
    )


@router.delete("/{roadmap_id}")
def delete_roadmap(
    roadmap_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete a learning roadmap and its steps.
    """
    roadmap = (
        db.query(LearningRoadmap)
        .filter(LearningRoadmap.id == roadmap_id, LearningRoadmap.user_id == current_user.id)
        .first()
    )
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap not found",
        )

    db.delete(roadmap)
    db.commit()

    calculate_readiness_score(db, str(current_user.id))
    return {"message": "Roadmap deleted successfully", "id": str(roadmap_id)}
