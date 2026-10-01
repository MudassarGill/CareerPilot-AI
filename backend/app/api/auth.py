"""
============================================================
CareerPilot AI — Authentication API Routes
============================================================
Handles user registration, login, verification, and profile.
============================================================
"""

from fastapi import APIRouter, Depends, HTTPException, status
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

router = APIRouter()


@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account and send verification email."""
    # Check for existing email
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    verification_token = create_verification_token()
    
    # Create new user with hashed password
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        verification_token=verification_token
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    email_service.send_verification_email(new_user.email, verification_token)

    return {"message": "Registration successful. Please check your email to verify your account."}


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
    """Authenticate and return short-lived access and long-lived refresh tokens."""
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # if not user.is_verified:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Please verify your email before logging in."
    #     )

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
    """Since JWTs are stateless, we just tell the client to discard tokens."""
    return {"message": "Successfully logged out."}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get the currently logged-in user profile."""
    return current_user


@router.put("/profile", response_model=UserResponse)
async def complete_profile(profile_data: ProfileSetup, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update initial profile information."""
    if profile_data.name:
        current_user.name = profile_data.name
    if profile_data.phone:
        current_user.phone = profile_data.phone
    if profile_data.target_role:
        current_user.target_role = profile_data.target_role
        
    current_user.profile_completed = True
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if user:
        from secrets import token_urlsafe
        from app.config import settings
        token = token_urlsafe(32)
        user.reset_password_token = token
        db.commit()
        # Mock email send
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        print(f"MOCK EMAIL: Password reset link for {user.email}: {reset_link}")
    
    return {"message": "If that email exists in our system, a password reset link has been sent."}

@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_password_token == req.token).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")
        
    user.hashed_password = hash_password(req.new_password)
    user.reset_password_token = None
    db.commit()
    
    return {"message": "Password successfully reset. You can now log in."}
