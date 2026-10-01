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

from pydantic import BaseModel
from typing import Optional

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    target_role: Optional[str] = None
    current_level: Optional[str] = None

@router.put("/me")
def update_current_user_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Updates the user profile data.
    """
    if data.name is not None:
        current_user.name = data.name
    if data.target_role is not None:
        current_user.target_role = data.target_role
    if data.current_level is not None:
        current_user.current_level = data.current_level
        
    db.commit()
    db.refresh(current_user)
    
    return {"message": "Profile updated successfully", "user": {
        "id": str(current_user.id),
        "name": current_user.name,
        "target_role": current_user.target_role,
        "current_level": current_user.current_level
    }}

@router.post("/me/avatar")
def upload_avatar(
    current_user: User = Depends(get_current_user)
):
    """
    Mock endpoint for avatar uploading. 
    In Phase 3 this just acts as a stub to accept the request.
    """
    return {"status": "success", "message": "Avatar updated", "avatarUrl": "/mock-avatar.png"}
