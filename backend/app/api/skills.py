"""
============================================================
CareerPilot AI — Skills API Routes
============================================================
Handles skills catalog, user skills management, role templates,
and AI skill gap analysis.

Endpoints:
    GET    /api/skills            → Catalog of available skills
    GET    /api/skills/roles      → Available target career roles
    GET    /api/skills/mine       → Current user's added skills
    POST   /api/skills/mine       → Add skill to user profile
    PUT    /api/skills/mine/{id}  → Update skill proficiency
    DELETE /api/skills/mine/{id}  → Remove skill from profile
    GET    /api/skills/gap        → Run skill gap analysis vs target role
============================================================
"""

from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.auth import get_current_user
from app.models.user import User
from app.models.skill import Skill, UserSkill
from app.agents.skill_gap_agent import SkillGapAgent
from app.schemas.skills import (
    SkillResponse,
    SkillCreate,
    SkillUpdate,
    UserSkillResponse,
    SkillGapItem,
    SkillGapResponse,
)

router = APIRouter(prefix="/skills", tags=["Skills"])
gap_agent = SkillGapAgent()


@router.get("", response_model=List[SkillResponse])
def get_all_skills(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search by name"),
    db: Session = Depends(get_db),
):
    """
    Returns the catalog of all available skills.
    Optional category and search query filtering.
    """
    query = db.query(Skill)
    if category:
        query = query.filter(Skill.category.ilike(f"%{category}%"))
    if search:
        query = query.filter(Skill.name.ilike(f"%{search}%"))
    skills = query.order_by(Skill.category, Skill.name).all()
    return skills


@router.get("/roles")
def get_available_roles():
    """
    Returns the list of supported target roles for skill gap analysis.
    """
    return {
        "roles": gap_agent.get_available_roles()
    }


@router.get("/mine", response_model=List[UserSkillResponse])
def get_user_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns the current user's skills with skill name and category.
    """
    records = (
        db.query(UserSkill, Skill)
        .join(Skill, UserSkill.skill_id == Skill.id)
        .filter(UserSkill.user_id == current_user.id)
        .order_by(Skill.category, Skill.name)
        .all()
    )

    results = []
    for user_skill, skill in records:
        results.append(
            UserSkillResponse(
                id=user_skill.id,
                skill_id=skill.id,
                skill_name=skill.name,
                skill_category=skill.category,
                level=user_skill.level,
                target_level=user_skill.target_level,
            )
        )
    return results


@router.post("/mine", response_model=UserSkillResponse, status_code=status.HTTP_201_CREATED)
def add_user_skill(
    payload: SkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Add a skill to the user's profile, or update it if already present.
    """
    skill = db.query(Skill).filter(Skill.id == payload.skill_id).first()
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found in catalog",
        )

    existing = (
        db.query(UserSkill)
        .filter(
            UserSkill.user_id == current_user.id,
            UserSkill.skill_id == payload.skill_id,
        )
        .first()
    )

    if existing:
        existing.level = max(0, min(100, payload.level))
        existing.target_level = max(0, min(100, payload.target_level or existing.target_level))
        db.commit()
        db.refresh(existing)
        return UserSkillResponse(
            id=existing.id,
            skill_id=skill.id,
            skill_name=skill.name,
            skill_category=skill.category,
            level=existing.level,
            target_level=existing.target_level,
        )

    new_user_skill = UserSkill(
        user_id=current_user.id,
        skill_id=skill.id,
        level=max(0, min(100, payload.level)),
        target_level=max(0, min(100, payload.target_level or 80)),
    )
    db.add(new_user_skill)
    db.commit()
    db.refresh(new_user_skill)

    return UserSkillResponse(
        id=new_user_skill.id,
        skill_id=skill.id,
        skill_name=skill.name,
        skill_category=skill.category,
        level=new_user_skill.level,
        target_level=new_user_skill.target_level,
    )


@router.put("/mine/{user_skill_id}", response_model=UserSkillResponse)
def update_user_skill(
    user_skill_id: UUID,
    payload: SkillUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update proficiency level or target level for a specific user skill.
    """
    record = (
        db.query(UserSkill)
        .filter(
            UserSkill.id == user_skill_id,
            UserSkill.user_id == current_user.id,
        )
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User skill not found",
        )

    if payload.level is not None:
        record.level = max(0, min(100, payload.level))
    if payload.target_level is not None:
        record.target_level = max(0, min(100, payload.target_level))

    db.commit()
    db.refresh(record)

    skill = db.query(Skill).filter(Skill.id == record.skill_id).first()

    return UserSkillResponse(
        id=record.id,
        skill_id=record.skill_id,
        skill_name=skill.name if skill else "Skill",
        skill_category=skill.category if skill else None,
        level=record.level,
        target_level=record.target_level,
    )


@router.delete("/mine/{user_skill_id}")
def delete_user_skill(
    user_skill_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Remove a skill from the user's profile.
    """
    record = (
        db.query(UserSkill)
        .filter(
            UserSkill.id == user_skill_id,
            UserSkill.user_id == current_user.id,
        )
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User skill not found",
        )

    db.delete(record)
    db.commit()

    return {"message": "Skill removed successfully", "id": str(user_skill_id)}


@router.get("/gap", response_model=SkillGapResponse)
async def analyze_skill_gap(
    target_role: Optional[str] = Query(None, description="Target career role"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Compares the user's current skills against requirements for target role.
    Defaults to the user's configured target_role or 'Frontend Developer'.
    """
    role = target_role or current_user.target_role or "Frontend Developer"

    # Fetch user skills
    records = (
        db.query(UserSkill, Skill)
        .join(Skill, UserSkill.skill_id == Skill.id)
        .filter(UserSkill.user_id == current_user.id)
        .all()
    )

    user_skills_dict = {skill.name: us.level for us, skill in records}

    # Run AI Skill Gap Agent
    gap_result = await gap_agent.analyze_gap(user_skills_dict, role)

    gap_items = [
        SkillGapItem(
            skill_name=g["skill_name"],
            category=g.get("category"),
            required_level=g["required_level"],
            current_level=g["current_level"],
            gap=g["gap"],
            status=g["status"],
        )
        for g in gap_result.get("gaps", [])
    ]

    return SkillGapResponse(
        target_role=gap_result.get("target_role", role),
        overall_match_pct=gap_result.get("overall_match_pct", 0.0),
        total_required=gap_result.get("total_required", 0),
        total_matched=gap_result.get("total_matched", 0),
        gaps=gap_items,
    )
