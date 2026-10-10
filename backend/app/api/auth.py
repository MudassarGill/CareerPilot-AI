"""
============================================================
CareerPilot AI — Authentication API Routes
============================================================
Handles user registration, login, verification, lockout,
resend verification, and Google OAuth stub.
============================================================
"""

from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.user import (
    UserCreate, UserLogin, UserResponse, Token,
    ProfileSetup, VerifyEmailRequest, RefreshTokenRequest, MessageResponse,
    ForgotPasswordRequest, ResetPasswordRequest
)
from app.models.user import User
from app.services.auth import (
    hash_password, verify_password, create_access_token,
    create_refresh_token, create_verification_token, get_current_user, verify_access_token
)
from app.services.email import email_service
from app.config import settings

router = APIRouter()

# Password validation helper
def validate_password_strength(password: str):
    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long."
        )
    has_letter = any(c.isalpha() for c in password)
    has_digit = any(c.isdigit() for c in password)
    if not (has_letter and has_digit):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain both letters and numbers."
        )


@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account and send verification email."""
    validate_password_strength(user_data.password)

    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    verification_token = create_verification_token()
    
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        verification_token=verification_token
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    await email_service.send_verification_email(new_user.email, verification_token)

    return {"message": "Registration successful. Please check your email to verify your account."}


@router.post("/resend-verification", response_model=MessageResponse)
async def resend_verification(email: str, db: Session = Depends(get_db)):
    """Resend verification email."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {"message": "If that email exists in our system, a verification link has been sent."}
    
    if user.is_verified:
        return {"message": "Email is already verified."}

    token = create_verification_token()
    user.verification_token = token
    db.commit()
    
    await email_service.send_verification_email(user.email, token)
    return {"message": "Verification email resent successfully."}


@router.post("/verify-email", response_model=MessageResponse)
async def verify_email(req: VerifyEmailRequest, db: Session = Depends(get_db)):
    """Verify user's email using the token."""
    user = db.query(User).filter(User.verification_token == req.token).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification token.")
        
    user.is_verified = True
    user.verification_token = None
    db.commit()
    
    return {"message": "Email verified successfully."}


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate with account lockout protection (5 failed attempts = 15 min lock)."""
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if user and user.locked_until and user.locked_until > datetime.utcnow():
        remaining = int((user.locked_until - datetime.utcnow()).total_seconds() / 60)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Account locked due to 5 failed login attempts. Try again in {remaining+1} minutes."
        )

    if not user or not verify_password(credentials.password, user.hashed_password):
        if user:
            user.failed_login_count = (user.failed_login_count or 0) + 1
            if user.failed_login_count >= 5:
                user.locked_until = datetime.utcnow() + timedelta(minutes=15)
            db.commit()

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Successful login reset lockout counter & update last_login_at
    user.failed_login_count = 0
    user.locked_until = None
    user.last_login_at = datetime.utcnow()
    db.commit()

    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse.model_validate(user),
    )


@router.post("/refresh-token", response_model=Token)
async def refresh_token(req: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Issue a new access token and refresh token via a valid refresh token."""
    payload = verify_access_token(req.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid or expired refresh token.")
        
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
        
    access_token = create_access_token(data={"sub": str(user.id)})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return Token(
        access_token=access_token,
        refresh_token=new_refresh_token,
        user=UserResponse.model_validate(user),
    )


@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out."}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if user:
        from secrets import token_urlsafe
        token = token_urlsafe(32)
        user.reset_password_token = token
        db.commit()
        
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        await email_service.send_email(
            to_email=user.email,
            subject="Reset Your CareerPilot AI Password",
            body=f"Hi {user.name},\n\nPlease click the link below to reset your password:\n{reset_link}\n\nThis link will expire in 2 hours."
        )
    
    return {"message": "If that email exists in our system, a password reset link has been sent."}


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_password_token == req.token).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token.")
        
    validate_password_strength(req.new_password)
    user.hashed_password = hash_password(req.new_password)
    user.reset_password_token = None
    db.commit()
    
    return {"message": "Password successfully reset. You can now log in."}


@router.get("/google")
async def google_auth():
    """Stub endpoint for Google OAuth feature flag."""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Google Sign-In is not enabled on this environment yet."
    )
