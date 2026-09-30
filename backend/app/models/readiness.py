import uuid
from datetime import datetime

from sqlalchemy import Column, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class CareerReadinessScore(Base):
    """
    Tracks the components and total career readiness score over time.
    """
    __tablename__ = "career_readiness_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    score = Column(Float, default=0.0)
    skills_part = Column(Float, default=0.0)
    resume_part = Column(Float, default=0.0)
    interview_part = Column(Float, default=0.0)
    learning_part = Column(Float, default=0.0)
    
    calculated_at = Column(DateTime, default=datetime.utcnow)
