"""
============================================================
CareerPilot AI — Authentication Services
============================================================
Provides password hashing and JWT token management for the
authentication system.

Functions:
    - hash_password()        → Hash plain text with bcrypt
    - verify_password()      → Check password against hash
    - create_access_token()  → Generate JWT access token
    - verify_access_token()  → Decode and validate JWT

Security Notes:
    - Passwords are NEVER stored in plain text
    - bcrypt automatically handles salting
    - JWT tokens expire after ACCESS_TOKEN_EXPIRE_MINUTES
    - Secret key must be kept secure (never commit to Git!)
============================================================
"""

from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings

# ---- Password Hashing Context ----
# Uses bcrypt algorithm with automatic salting
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a plain text password using bcrypt.

    Args:
        password: Plain text password from user input

    Returns:
        str: Bcrypt-hashed password string

    Example:
        hashed = hash_password("mySecureP@ss123")
        # Returns: "$2b$12$LJ3m5..."
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain text password against a bcrypt hash.

    Args:
        plain_password: Password from login form
        hashed_password: Stored hash from database

    Returns:
        bool: True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token with an expiration time.

    Args:
        data: Payload to encode (typically {"sub": user_id})
        expires_delta: Custom expiration time (optional)

    Returns:
        str: Encoded JWT token string
    """
    to_encode = data.copy()

    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
    return encoded_jwt


def verify_access_token(token: str) -> Optional[dict]:
    """
    Decode and validate a JWT access token.

    Args:
        token: JWT token string from Authorization header

    Returns:
        dict: Decoded payload if valid, None if invalid/expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return payload
    except JWTError:
        return None
