from pydantic import BaseModel, EmailStr
from typing import Optional

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    honeypot: Optional[str] = None
