from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
import time

from app.db.database import get_db
from app.schemas.contact import ContactMessageCreate
from app.models.contact import ContactMessage

from app.services.email import email_service
from app.core.brand import brand_config

router = APIRouter()

# Simple in-memory rate limiting dict: IP -> List of timestamps
_contact_rate_limit = {}

@router.post("")
async def submit_contact_message(
    message: ContactMessageCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    
    # 1. Rate limit check: Max 5 submissions per hour per IP
    timestamps = _contact_rate_limit.get(client_ip, [])
    # Keep only timestamps within the last hour (3600s)
    timestamps = [t for t in timestamps if now - t < 3600]
    if len(timestamps) >= 5:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Contact submission limit reached (5 per hour). Please try again later."
        )
    
    # 2. Check honeypot (silent fail for bots)
    if message.honeypot:
        return {"status": "success", "message": "Message sent."}

    # 3. Store message in database
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

    # Update rate limit tracker
    timestamps.append(now)
    _contact_rate_limit[client_ip] = timestamps

    # 4. Send email to admin & auto-reply to user via email_service
    await email_service.send_email(
        to_email=brand_config.email,
        subject=f"[Contact Form] {message.subject} from {message.name}",
        body=f"From: {message.name} <{message.email}>\nPhone: {message.phone or 'N/A'}\nSubject: {message.subject}\n\nMessage:\n{message.message}"
    )

    await email_service.send_email(
        to_email=message.email,
        subject=f"We received your message — {brand_config.owner} / CareerPilot AI",
        body=f"Hi {message.name},\n\nThank you for reaching out! We received your message regarding '{message.subject}' and will get back to you within 1-2 business days.\n\nBest regards,\nCareerPilot AI Team"
    )

    return {"status": "success", "message": "Message sent successfully!"}
