"""
============================================================
CareerPilot AI — API Route Handlers
============================================================
This package contains all REST API route handlers, organized
by feature. Each file defines a FastAPI APIRouter.

Files:
    - auth.py         → POST /register, POST /login
    - resume.py       → POST /upload, POST /ats-score
    - interview.py    → POST /start, POST /answer
    - roadmap.py      → POST /generate
    - career_twin.py  → POST /simulate
    - crs.py          → GET /score

All routers are registered in app/main.py with their
respective URL prefixes (e.g., /api/auth, /api/resume).
============================================================
"""
