"""
============================================================
CareerPilot AI — Email Service
============================================================
Handles sending emails for verification, password reset, etc.
Currently uses a ConsoleEmailService for local testing.
============================================================
"""

from typing import Protocol


class EmailService(Protocol):
    def send_verification_email(self, to_email: str, token: str) -> None:
        ...


class ConsoleEmailService:
    """Mock email service that prints links to the console."""

    def __init__(self, frontend_url: str):
        self.frontend_url = frontend_url

    def send_verification_email(self, to_email: str, token: str) -> None:
        verify_link = f"{self.frontend_url}/verify-email?token={token}"
        print("=" * 60)
        print(f"📧 EMAIL MOCK: To {to_email}")
        print(f"Subject: Verify your CareerPilot AI account")
        print(f"Body:\nClick this link to verify your email:\n{verify_link}")
        print("=" * 60)


# Initialize our service injected via Config/settings
from app.config import settings

email_service = ConsoleEmailService(frontend_url=settings.FRONTEND_URL)
