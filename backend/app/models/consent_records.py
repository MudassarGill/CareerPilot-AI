import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base

class ConsentRecord(Base):
    __tablename__ = "consent_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(50), nullable=False) # e.g. "recording", "data_processing"
    granted = Column(Boolean, nullable=False)
    granted_at = Column(DateTime, default=datetime.utcnow)
    ip = Column(String(50), nullable=True)
