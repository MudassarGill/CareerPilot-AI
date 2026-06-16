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

All models inherit from Base (defined in db/database.py)
and use UUID primary keys for security.
============================================================
"""
