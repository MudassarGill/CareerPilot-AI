"""
============================================================
CareerPilot AI — Email Service
============================================================
Console-based email service for development. Structured so a
real SMTP or third-party service can be plugged in later by
implementing the EmailService base class.
============================================================
"""

from abc import ABC, abstractmethod
from app.config import settings


class EmailService(ABC):
    """Base class for email services."""

    @abstractmethod
    def send_verification_email(self, to_email: str, token: str) -> None:
        """Send a verification email to the user."""
        pass


class ConsoleEmailService(EmailService):
    """
    Development email service — prints the verification link
    to the console instead of actually sending an email.
    """

    def send_verification_email(self, to_email: str, token: str) -> None:
        verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
        print("\n" + "=" * 60)
        print("📧  VERIFICATION EMAIL (Console Mode)")
        print("=" * 60)
        print(f"  To:    {to_email}")
        print(f"  Link:  {verification_url}")
        print(f"  Token: {token}")
        print("=" * 60 + "\n")


# ---- Default Service Instance ----
# Swap this with SMTPEmailService (or SendGridEmailService, etc.)
# when ready for production.
email_service = ConsoleEmailService()
