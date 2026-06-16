# CareerPilot AI — Backend

This directory contains the **FastAPI** backend server for CareerPilot AI.

## Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Environment settings & configuration
│   ├── models/              # SQLAlchemy database models
│   ├── schemas/             # Pydantic request/response schemas
│   ├── api/                 # REST API route handlers
│   ├── agents/              # LangGraph multi-agent definitions
│   ├── services/            # Business logic layer
│   ├── rag/                 # RAG pipeline (embeddings, vector store)
│   ├── utils/               # Helper utilities (PDF parsing, etc.)
│   └── db/                  # Database connection & migrations
├── tests/                   # Pytest test suite
├── requirements.txt         # Python dependencies
└── Dockerfile               # Container build configuration
```

## Quick Start

```bash
# 1. Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up environment variables
copy ..\.env.example ..\.env   # Edit with your real values

# 4. Run the server
uvicorn app.main:app --reload --port 8000
```

## API Docs

Once running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
