from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
import time

from app.db.database import get_db
from app.schemas.contact import ContactMessageCreate
from app.models.contact import ContactMessage

router = APIRouter()

# Simple in-memory rate limiting dict: IP -> Timestamp
_contact_rate_limit = {}

@router.post("")
def submit_contact_message(
    message: ContactMessageCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    # 1. Check Rate Limit (e.g., 1 message per 5 minutes per IP)
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    
    if client_ip in _contact_rate_limit:
        last_time = _contact_rate_limit[client_ip]
        if now - last_time < 300:  # 5 minutes
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="You have submitted a message recently. Please wait before trying again."
            )
            
    # 2. Check honeypot (bots will typically fill this out)
    if message.honeypot:
        # Silently drop it without storing, but pretend it worked
        return {"status": "success", "message": "Message sent."}

    # 3. Store the message
    db_message = ContactMessage(
        name=message.name,
        email=message.email,
        phone=message.phone,
        subject=message.subject,
        message=message.message,
        ip=client_ip
    )
    
    db.add(db_message)
    db.commit()
    
    # Update rate limit
    _contact_rate_limit[client_ip] = now
    
    return {"status": "success", "message": "Message sent."}
