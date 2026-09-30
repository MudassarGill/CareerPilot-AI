from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.skill import Skill, UserSkill

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("")
def get_all_skills(db: Session = Depends(get_db)):
    """
    Returns the catalog of all available skills.
    """
    skills = db.query(Skill).all()
    return [{"id": str(s.id), "name": s.name, "category": s.category} for s in skills]

@router.get("/mine")
def get_user_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns the current user's skills.
    """
    user_skills = db.query(UserSkill).filter(UserSkill.user_id == current_user.id).all()
    # would join with Skill to return names, keeping simple for now
    return [{"skill_id": str(us.skill_id), "level": us.level, "target": us.target_level} for us in user_skills]
