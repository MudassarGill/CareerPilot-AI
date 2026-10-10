from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from sqlalchemy.exc import IntegrityError

from app.db.database import get_db
from app.models.newsletter import NewsletterSubscriber

router = APIRouter()

class SubscribeRequest(BaseModel):
    email: EmailStr

@router.post("/subscribe")
def subscribe(request: SubscribeRequest, db: Session = Depends(get_db)):
    sub = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == request.email).first()
    if sub:
        if sub.confirmed and not sub.unsubscribed_at:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You are already subscribed to the newsletter."
            )
        else:
            sub.confirmed = True
            sub.unsubscribed_at = None
            db.commit()
            return {"status": "success", "message": "Resubscribed successfully!"}
    
    new_sub = NewsletterSubscriber(email=request.email, confirmed=True)
    db.add(new_sub)
    db.commit()
    return {"status": "success", "message": "Subscribed successfully!"}

@router.get("/unsubscribe")
def unsubscribe(email: EmailStr, db: Session = Depends(get_db)):
    sub = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == email).first()
    if not sub or sub.unsubscribed_at:
        return {"status": "success", "message": "Email is not subscribed."}

    from datetime import datetime
    sub.unsubscribed_at = datetime.utcnow()
    db.commit()
    return {"status": "success", "message": "Unsubscribed successfully."}
