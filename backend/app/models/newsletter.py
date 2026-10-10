import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base

class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    confirmed = Column(Boolean, default=True)
    unsubscribed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
