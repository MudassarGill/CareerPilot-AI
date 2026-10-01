"""
============================================================
CareerPilot AI — Email Service
============================================================
Handles sending emails for verification, password reset, etc.
Currently uses a ConsoleEmailService for local testing,
but can be configured for Mailpit or actual SMTP.
============================================================
"""

import logging
from typing import Protocol
import aiosmtplib
from email.message import EmailMessage
from app.config import settings

logger = logging.getLogger(__name__)

class EmailService(Protocol):
    async def send_verification_email(self, to_email: str, token: str) -> None:
        ...

class ConsoleEmailService:
    """Mock email service that prints links to the console."""
    def __init__(self, frontend_url: str):
        self.frontend_url = frontend_url

    async def send_verification_email(self, to_email: str, token: str) -> None:
        verify_link = f"{self.frontend_url}/verify-email?token={token}"
        print("=" * 60)
        print(f"📧 EMAIL MOCK: To {to_email}")
        print(f"Subject: Verify your CareerPilot AI account")
        print(f"Body:\nClick this link to verify your email:\n{verify_link}")
        print("=" * 60)
        
        # Optionally send to mailpit if running
        try:
            msg = EmailMessage()
            msg["From"] = settings.EMAILS_FROM_EMAIL
            msg["To"] = to_email
            msg["Subject"] = "Verify your CareerPilot AI account"
            msg.set_content(f"Click this link to verify your email:\n{verify_link}")
            
            await aiosmtplib.send(
                msg,
                hostname="localhost",
                port=1025,
                use_tls=False
            )
        except Exception:
            pass

email_service = ConsoleEmailService(frontend_url=settings.FRONTEND_URL)
