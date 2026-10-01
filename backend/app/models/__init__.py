"""
============================================================
CareerPilot AI — SQLAlchemy Database Models
============================================================
This package defines the database table structures using
SQLAlchemy ORM. Each file maps to one or more related tables:

    - user.py            → Users table (auth, profile)
    - resume.py          → Resumes table (uploads, parsed data)
    - career_profile.py  → Career profiles (skills, CRS, roadmap)
    - interview.py       → Mock interviews (questions, feedback)
    - skill.py           → Skills catalogs and user mapped skills
    - learning.py        → Learning roadmaps and steps
    - readiness.py       → Career readiness score records

All models inherit from Base (defined in db/database.py)
and use UUID primary keys for security.
============================================================
"""

from app.models.user import User
from app.models.resume import Resume
from app.models.career_profile import CareerProfile
from app.models.interview import Interview
from app.models.skill import Skill, UserSkill
from app.models.learning import LearningRoadmap, LearningStep
from app.models.readiness import CareerReadinessScore
from app.models.contact import ContactMessage
from app.models.newsletter import NewsletterSubscriber
from app.models.notification import Notification
