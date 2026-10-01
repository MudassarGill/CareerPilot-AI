from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
):
    """
    Returns the current logged-in user profile data.
    """
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "name": current_user.name,
        "target_role": current_user.target_role,
        "current_level": current_user.current_level,
        "profile_completed": current_user.profile_completed
    }

@router.put("/me")
def update_current_user_profile(
    target_role: str = None,
    current_level: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Updates the user profile data.
    """
    if target_role is not None:
        current_user.target_role = target_role
    if current_level is not None:
        current_user.current_level = current_level
        
    db.commit()
    db.refresh(current_user)
    
    return {"message": "Profile updated successfully", "user": {
        "id": str(current_user.id),
        "target_role": current_user.target_role,
        "current_level": current_user.current_level
    }}
