"""
============================================================
CareerPilot AI — User Pydantic Schemas
============================================================
Defines the request/response shapes for user-related endpoints:

    - UserCreate   : Registration request body
    - UserLogin    : Login request body
    - UserResponse : What we return to the client (no password!)
    - Token        : JWT token response after login

These schemas ensure that:
    1. Incoming data is validated before hitting the database
    2. Passwords are never included in API responses
    3. Swagger UI shows accurate request/response examples
============================================================
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID


class UserCreate(BaseModel):
    """
    Schema for user registration.
    Client sends: name, email, password.
    """
    name: str
    email: EmailStr
    password: str  # Plain text — hashed before storing


class UserLogin(BaseModel):
    """
    Schema for user login.
    Client sends: email, password.
    """
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """
    Schema for user data returned to the client.
    NOTE: password is NEVER included in responses.
    """
    id: UUID
    name: str
    email: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True  # Allow ORM model → Pydantic conversion


class Token(BaseModel):
    """
    JWT token response returned after successful login.
    """
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
