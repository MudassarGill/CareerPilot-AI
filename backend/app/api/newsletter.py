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
    try:
        sub = NewsletterSubscriber(email=request.email)
        db.add(sub)
        db.commit()
        return {"status": "success", "message": "Subscribed successfully!"}
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already subscribed to the newsletter."
        )
