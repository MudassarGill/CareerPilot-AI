"""
============================================================
CareerPilot AI — User & Profile API Routes
============================================================
Handles user profile management, avatar upload, completeness
calculation, preferences, data export, and account deletion.
============================================================
"""

import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Response
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.auth import get_current_user, hash_password, verify_password
from app.models.user import User
from app.models.user_preferences import UserPreferences
from app.models.consent_records import ConsentRecord
from app.models.audit_logs import AuditLog
from app.schemas.user import UserResponse, ProfileUpdate, PasswordChangeRequest, UserPreferencesSchema
from app.services.storage_service import storage_service

router = APIRouter(prefix="/users", tags=["Users"])


def calculate_completeness(user: User) -> int:
    """
    Calculates profile completeness score out of 100 based on populated fields:
    - name: 10
    - avatar_path: 10
    - headline: 10
    - phone: 5
    - location: 10
    - target_role: 20
    - current_level: 10
    - education: 15
    - bio: 10
    """
    score = 0
    if user.name: score += 10
    if user.avatar_path: score += 10
    if user.headline: score += 10
    if user.phone: score += 5
    if user.location: score += 10
    if user.target_role: score += 20
    if user.current_level: score += 10
    if user.education: score += 15
    if user.bio: score += 10
    return min(score, 100)


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.profile_completeness = calculate_completeness(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/me", response_model=UserResponse)
def update_current_user_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if data.name is not None: current_user.name = data.name
    if data.phone is not None: current_user.phone = data.phone
    if data.target_role is not None: current_user.target_role = data.target_role
    if data.current_level is not None: current_user.current_level = data.current_level
    if data.headline is not None: current_user.headline = data.headline
    if data.bio is not None: current_user.bio = data.bio
    if data.location is not None: current_user.location = data.location
    if data.education is not None: current_user.education = data.education
    if data.links_json is not None: current_user.links_json = data.links_json

    current_user.profile_completeness = calculate_completeness(current_user)
    current_user.profile_completed = (current_user.profile_completeness >= 60)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/me/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    avatar_url = await storage_service.save_avatar(file)
    current_user.avatar_path = avatar_url
    current_user.profile_completeness = calculate_completeness(current_user)
    db.commit()
    return {"status": "success", "message": "Avatar uploaded successfully.", "avatar_url": avatar_url}


@router.put("/me/password")
def change_password(
    req: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(req.current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect.")
    
    current_user.hashed_password = hash_password(req.new_password)
    db.commit()
    return {"status": "success", "message": "Password changed successfully."}


@router.get("/me/preferences", response_model=UserPreferencesSchema)
def get_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prefs = db.query(UserPreferences).filter(UserPreferences.user_id == current_user.id).first()
    if not prefs:
        prefs = UserPreferences(user_id=current_user.id)
        db.add(prefs)
        db.commit()
        db.refresh(prefs)
    return prefs


@router.put("/me/preferences", response_model=UserPreferencesSchema)
def update_preferences(
    data: UserPreferencesSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prefs = db.query(UserPreferences).filter(UserPreferences.user_id == current_user.id).first()
    if not prefs:
        prefs = UserPreferences(user_id=current_user.id)
        db.add(prefs)

    old_recording_consent = prefs.interview_recording_consent
    prefs.email_notifications = data.email_notifications
    prefs.weekly_report_email = data.weekly_report_email
    prefs.interview_recording_consent = data.interview_recording_consent
    prefs.language = data.language
    prefs.timezone = data.timezone

    # Record consent change if interview recording consent changed
    if old_recording_consent != data.interview_recording_consent:
        consent_log = ConsentRecord(
            user_id=current_user.id,
            type="interview_recording",
            granted=data.interview_recording_consent
        )
        db.add(consent_log)

    db.commit()
    db.refresh(prefs)
    return prefs


@router.get("/me/export")
def export_user_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    export_payload = {
        "user_id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "target_role": current_user.target_role,
        "current_level": current_user.current_level,
        "headline": current_user.headline,
        "bio": current_user.bio,
        "location": current_user.location,
        "education": current_user.education,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
        "resumes_count": len(current_user.resumes),
        "interviews_count": len(current_user.interviews),
        "exported_at": datetime.utcnow().isoformat()
    }
    json_data = json.dumps(export_payload, indent=2)
    return Response(
        content=json_data,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=careerpilot_data_{current_user.id}.json"}
    )


@router.delete("/me")
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Log deletion in audit table
    audit_log = AuditLog(
        actor_id=current_user.id,
        action="ACCOUNT_DELETED",
        entity="User",
        entity_id=str(current_user.id),
        metadata_json={"email": current_user.email}
    )
    db.add(audit_log)
    
    # Delete user (cascades to preferences, resumes, interviews, etc.)
    db.delete(current_user)
    db.commit()
    return {"status": "success", "message": "Account permanently deleted."}
