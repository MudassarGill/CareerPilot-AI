"""
============================================================
CareerPilot AI — Business Services Layer
============================================================
This package contains the core business logic, separated
from API routes and database models for clean architecture.

Files:
    - auth.py    → Password hashing, JWT token creation/verification
    - resume.py  → Resume file processing logic (coming Phase 1)
    - career.py  → CRS calculation, career simulation (coming Phase 3)

Design Pattern:
    Routes (API layer) → Services (business logic) → Models (DB)
    This separation makes the code testable and maintainable.
============================================================
"""
