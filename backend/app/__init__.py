"""
============================================================
CareerPilot AI — Backend Application Package
============================================================
This __init__.py makes the 'app' directory a Python package.
The backend application is structured as follows:

    app/
    ├── main.py        → FastAPI entry point
    ├── config.py      → Environment configuration
    ├── models/        → SQLAlchemy database models
    ├── schemas/       → Pydantic request/response schemas
    ├── api/           → REST API route handlers
    ├── agents/        → LangGraph multi-agent definitions
    ├── services/      → Business logic layer
    ├── rag/           → RAG pipeline components
    ├── utils/         → Helper utilities
    └── db/            → Database connection & migrations

Each sub-package has its own __init__.py with detailed
documentation explaining its purpose.
============================================================
"""
