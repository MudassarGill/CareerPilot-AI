import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    actor_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    action = Column(String(100), nullable=False)
    entity = Column(String(100), nullable=False)
    entity_id = Column(String(255), nullable=True)
    metadata_json = Column(JSON, nullable=True)
    ip = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
