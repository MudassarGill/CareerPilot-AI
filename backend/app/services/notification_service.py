"""
============================================================
CareerPilot AI — Notification Service Helper
============================================================
Provides reusable notify() helper for system notifications.
============================================================
"""

from typing import Optional
import uuid
from sqlalchemy.orm import Session
from app.models.notification import Notification

def notify(
    db: Session,
    user_id: uuid.UUID,
    title: str,
    message: str,
    notif_type: str = "info",
    link: Optional[str] = None
) -> Notification:
    """
    Creates and saves a new notification for a specific user.
    Types: 'info', 'success', 'warning', 'error'
    """
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notif_type,
        link=link,
        read=False
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
