"""
============================================================
CareerPilot AI — User Pydantic Schemas
============================================================
Request / response shapes for all auth-related endpoints.
============================================================
"""

from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from uuid import UUID


# -------- Request Schemas --------

class UserCreate(BaseModel):
    """Registration request body."""
    name: str
    email: EmailStr
    password: str
    confirm_password: str

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v

    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class UserLogin(BaseModel):
    """Login request body."""
    email: EmailStr
    password: str


class VerifyEmailRequest(BaseModel):
    """Email verification request body."""
    token: str


class ProfileSetup(BaseModel):
    """Profile completion request body."""
    name: Optional[str] = None
    phone: Optional[str] = None
    target_role: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    """Refresh token request body."""
    refresh_token: str


# -------- Response Schemas --------

class UserResponse(BaseModel):
    """User data returned to the client (no password)."""
    id: UUID
    name: str
    email: str
    is_active: bool
    is_verified: bool
    phone: Optional[str] = None
    target_role: Optional[str] = None
    profile_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """JWT token response after successful login."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
