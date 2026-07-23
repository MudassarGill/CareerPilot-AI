"""
============================================================
CareerPilot AI — Test Suite
============================================================
Automated tests for the CareerPilot AI backend using pytest.

Structure:
    tests/
    ├── unit/           → Unit tests (individual functions)
    │   ├── test_auth.py        → Auth service tests
    │   ├── test_resume.py      → Resume parsing tests
    │   └── test_agents.py      → Agent logic tests
    └── integration/    → Integration tests (full API flows)
        ├── test_auth_flow.py   → Registration + login flow
        └── test_resume_flow.py → Upload + score flow

Run all tests:
    pytest tests/ -v

Run with coverage:
    pytest tests/ --cov=app --cov-report=html
============================================================
"""
