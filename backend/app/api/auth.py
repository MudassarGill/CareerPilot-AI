"""
============================================================
CareerPilot AI — Authentication API Routes
============================================================
Handles user registration and login endpoints.

Endpoints:
    POST /api/auth/register  → Create a new user account
    POST /api/auth/login     → Authenticate and get JWT token

Security:
    - Passwords are hashed with bcrypt before storage
    - JWT tokens are issued on successful login
    - Token expiration is configured in config.py

Dependencies:
    - app.schemas.user    → UserCreate, UserLogin, Token
    - app.models.user     → User ORM model
    - app.db.database     → get_db session dependency
    - app.services.auth   → hash_password, verify_password, create_token
============================================================
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.models.user import User
from app.services.auth import hash_password, verify_password, create_access_token

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account.

    Steps:
        1. Check if email already exists
        2. Hash the password with bcrypt
        3. Create the user record in PostgreSQL
        4. Return the user data (without password)
    """
    # Check for existing email
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    # Create new user with hashed password
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate a user and return a JWT token.

    Steps:
        1. Look up user by email
        2. Verify password against stored hash
        3. Generate JWT access token
        4. Return token + user info
    """
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate JWT token
    access_token = create_access_token(data={"sub": str(user.id)})

    return Token(
        access_token=access_token,
        user=UserResponse.model_validate(user),
    )
