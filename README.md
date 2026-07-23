<p align="center">
  <h1 align="center">🚀 CareerPilot AI</h1>
  <p align="center">
    <strong>Multi-Agent Career Intelligence, Simulation &amp; Automation Platform</strong>
  </p>
  <p align="center">
    Powered by Generative AI · LangGraph · RAG · Computer Vision · Speech Intelligence
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#api-reference">API Reference</a> •
    <a href="#roadmap">Roadmap</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#license">License</a>
  </p>
</p>

---

## 📖 Overview

**CareerPilot AI** is an end-to-end, multi-agent career intelligence platform that leverages **Generative AI**, **Retrieval-Augmented Generation (RAG)**, **Computer Vision**, **Speech Intelligence**, and **Career Analytics** to transform how professionals prepare for their careers.

The platform provides:

- **ATS Resume Evaluation** — Score your resume against job descriptions for Applicant Tracking System compatibility.
- **Skill-Gap Analysis** — Identify missing skills by comparing your profile to target role requirements.
- **AI Mock Interviews** — Conduct realistic mock interviews with real-time feedback (text, voice, and video modes).
- **Career Readiness Scoring** — Get a composite score (0–100) that measures your overall career preparedness.
- **Personalized Learning Roadmaps** — Receive a structured, week-by-week learning plan to close skill gaps.
- **Future Career Simulations** — Simulate 1-year, 3-year, and 5-year career trajectories with salary projections.

---

## ✨ Features

### 🤖 Multi-Agent System (LangGraph)

CareerPilot AI is built on a **LangGraph-powered multi-agent architecture** where an Orchestrator routes user requests to seven specialist agents:

| Agent | Description |
|---|---|
| **🎯 Orchestrator** | Central coordinator — parses user intent, routes to the right agent(s), and merges results from multi-step workflows. |
| **📄 Resume Analyzer** | Parses PDF/DOCX resumes using PyMuPDF & spaCy NER. Extracts structured sections (Education, Experience, Skills, Projects) and evaluates content quality. |
| **📊 ATS Scorer** | Scores resumes against job descriptions using keyword extraction, cosine similarity, formatting checks, and section quality analysis. Returns a 0–100 score with missing keywords and tips. |
| **🔍 Skill Gap Analyzer** | Compares user skills against target role requirements via RAG. Categorizes each skill as Strong / Adequate / Weak / Missing and generates a priority-ranked gap list. |
| **📚 Learning Roadmap** | Generates personalized weekly/monthly learning plans using RAG-retrieved courses, tutorials, and documentation. Includes free & paid resources with estimated hours. |
| **🎤 Interview Coach** | Conducts AI-powered mock interviews with role-specific questions, answer evaluation via scoring rubrics, and per-question feedback. Supports Text, Voice (Whisper STT + gTTS), and Video modes. |
| **📈 Career Readiness Score (CRS)** | Calculates a composite 0–100 score: `CRS = (0.25 × ATS) + (0.25 × Skill Coverage) + (0.20 × Interview) + (0.15 × Learning Progress) + (0.15 × Profile Completeness)`. Includes radar chart data and actionable recommendations. |
| **🔮 Career Twin** | Simulates future career trajectories based on user profile, skills, and goals. Outputs predicted roles, salary ranges, and required skills at each career stage with an interactive timeline. |

### 📡 RAG Pipeline

- **ChromaDB** vector store for semantic search over job descriptions, skill taxonomies, and course catalogs
- **Sentence-Transformers** for high-quality text embeddings
- Auto-indexes `.txt`, `.md`, and `.json` knowledge base documents on startup

### 🔐 Authentication & Security

- JWT-based authentication with configurable token expiration
- Bcrypt password hashing via Passlib
- Secure user registration and login endpoints

### 🐳 Fully Dockerized

- One-command deployment with Docker Compose
- Services: FastAPI backend, Next.js frontend, PostgreSQL 16, Redis 7

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js Frontend                         │
│                    (React · TailwindCSS · SWR)                  │
└───────────────────────────────┬─────────────────────────────────┘
                                │ REST API
┌───────────────────────────────▼─────────────────────────────────┐
│                      FastAPI Backend                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              🎯 LangGraph Orchestrator                   │    │
│  │  ┌──────────┬──────────┬──────────┬──────────┐          │    │
│  │  │ Resume   │   ATS    │  Skill   │ Roadmap  │          │    │
│  │  │ Analyzer │  Scorer  │   Gap    │ Builder  │          │    │
│  │  ├──────────┼──────────┼──────────┼──────────┤          │    │
│  │  │Interview │   CRS    │ Career   │          │          │    │
│  │  │  Coach   │  Agent   │  Twin    │          │          │    │
│  │  └──────────┴──────────┴──────────┴──────────┘          │    │
│  └───────────────────────┬─────────────────────────────────┘    │
│                          │                                      │
│  ┌───────────┐   ┌───────▼───────┐   ┌──────────────────┐      │
│  │   Auth    │   │  RAG Pipeline │   │   PDF / DOCX     │      │
│  │  (JWT +   │   │  (ChromaDB +  │   │   Parser         │      │
│  │  Bcrypt)  │   │  Embeddings)  │   │ (PyMuPDF/spaCy)  │      │
│  └───────────┘   └───────────────┘   └──────────────────┘      │
└──────────┬────────────────┬──────────────────┬──────────────────┘
           │                │                  │
    ┌──────▼──────┐  ┌──────▼──────┐    ┌──────▼──────┐
    │ PostgreSQL  │  │  ChromaDB   │    │    Redis    │
    │   16        │  │ Vector DB   │    │    Cache    │
    └─────────────┘  └─────────────┘    └─────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend Framework** | FastAPI 0.115 · Uvicorn |
| **AI / LLM** | LangChain 0.3 · LangGraph 0.2 · Google Gemini (generativeai) |
| **RAG Pipeline** | ChromaDB 0.5 · Sentence-Transformers 3.0 |
| **Resume Parsing** | PyMuPDF · pdfplumber · python-docx · spaCy 3.7 |
| **Speech Intelligence** | OpenAI Whisper (STT) · gTTS (TTS) |
| **Database** | PostgreSQL 16 · SQLAlchemy 2.0 · Alembic |
| **Cache** | Redis 7 |
| **Authentication** | JWT (python-jose) · Bcrypt (Passlib) |
| **Frontend** | Next.js (planned) |
| **DevOps** | Docker · Docker Compose |
| **Language** | Python 3.11 |

---

## 📂 Project Structure

```
CareerPilot-AI/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point & middleware
│   │   ├── config.py            # Pydantic Settings (env vars)
│   │   ├── agents/              # LangGraph multi-agent system
│   │   │   ├── orchestrator.py  # Central request router
│   │   │   ├── resume_agent.py  # Resume parsing & analysis
│   │   │   ├── ats_agent.py     # ATS compatibility scoring
│   │   │   ├── skill_gap_agent.py # Skill gap identification
│   │   │   ├── roadmap_agent.py # Learning roadmap generation
│   │   │   ├── interview_agent.py # AI mock interviews
│   │   │   ├── crs_agent.py     # Career Readiness Score
│   │   │   └── career_twin_agent.py # Career simulation
│   │   ├── api/                 # REST API route handlers
│   │   │   ├── auth.py          # Register / Login endpoints
│   │   │   ├── resume.py        # Resume upload & analysis
│   │   │   ├── interview.py     # Mock interview sessions
│   │   │   ├── roadmap.py       # Learning roadmap endpoints
│   │   │   ├── career_twin.py   # Career simulation endpoints
│   │   │   └── crs.py           # Career Readiness endpoints
│   │   ├── models/              # SQLAlchemy ORM models
│   │   │   ├── user.py          # User accounts
│   │   │   ├── resume.py        # Resume records
│   │   │   ├── interview.py     # Interview sessions
│   │   │   └── career_profile.py # Career profiles
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── services/            # Business logic layer
│   │   │   └── auth.py          # Password hashing & JWT
│   │   ├── rag/                 # RAG pipeline
│   │   │   ├── embeddings.py    # Sentence-Transformer embeddings
│   │   │   ├── vector_store.py  # ChromaDB integration
│   │   │   └── retriever.py     # Semantic search retriever
│   │   ├── utils/               # Utilities
│   │   │   └── pdf_parser.py    # PDF/DOCX text extraction
│   │   └── db/                  # Database layer
│   │       └── database.py      # SQLAlchemy engine & sessions
│   ├── tests/                   # Pytest test suite
│   ├── requirements.txt         # Python dependencies
│   └── Dockerfile               # Backend container config
├── data/                        # RAG knowledge base
│   ├── job_descriptions/        # Sample JDs for ATS scoring
│   ├── skill_taxonomies/        # Role → skill mappings
│   └── course_catalogs/         # Learning resources
├── docker-compose.yml           # Multi-service orchestration
├── .env.example                 # Environment variable template
├── .gitignore                   # Git ignore rules
├── LICENSE                      # MIT License
└── README.md                    # ← You are here
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **PostgreSQL 16+**
- **Redis 7+** (optional, for caching)
- **Docker & Docker Compose** (recommended)
- A **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Option 1: Docker Compose (Recommended)

The fastest way to get everything running:

```bash
# 1. Clone the repository
git clone https://github.com/MudassarGill/CareerPilot-AI.git
cd CareerPilot-AI

# 2. Configure environment variables
cp .env.example .env
# Edit .env with your actual API keys and secrets

# 3. Build and start all services
docker-compose up --build

# 4. Access the application
#    Backend API:  http://localhost:8000
#    API Docs:     http://localhost:8000/docs
#    Frontend:     http://localhost:3000  (when implemented)
```

### Option 2: Local Development

```bash
# 1. Clone the repository
git clone https://github.com/MudassarGill/CareerPilot-AI.git
cd CareerPilot-AI

# 2. Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

# 3. Install backend dependencies
cd backend
pip install -r requirements.txt

# 4. Download the spaCy English model
python -m spacy download en_core_web_sm

# 5. Set up environment variables
cd ..
cp .env.example .env
# Edit .env with your actual values (API keys, database URL, etc.)

# 6. Start PostgreSQL & Redis
# Make sure PostgreSQL and Redis are running locally,
# or use Docker for just the databases:
docker-compose up db redis -d

# 7. Run the FastAPI backend
cd backend
uvicorn app.main:app --reload --port 8000

# 8. Verify it's working
curl http://localhost:8000/health
# → {"status": "healthy", "service": "CareerPilot AI Backend"}
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and configure the following:

| Variable | Description | Default |
|---|---|---|
| `GOOGLE_API_KEY` | Google Gemini API key for LLM | *required* |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/careerpilot_db` |
| `CHROMA_PERSIST_DIR` | ChromaDB persistence directory | `./data/chroma_db` |
| `SECRET_KEY` | JWT signing secret | `change-me-in-production` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token lifetime | `60` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379/0` |
| `BACKEND_HOST` | Backend server host | `0.0.0.0` |
| `BACKEND_PORT` | Backend server port | `8000` |
| `DEBUG` | Enable debug mode | `True` |
| `NEXT_PUBLIC_API_URL` | Frontend → Backend API URL | `http://localhost:8000/api` |
| `NEXTAUTH_SECRET` | NextAuth.js secret | *required for frontend* |
| `NEXTAUTH_URL` | NextAuth.js URL | `http://localhost:3000` |

---

## 📡 API Reference

Once the backend is running, interactive API documentation is available at:

| Docs | URL |
|---|---|
| **Swagger UI** | [http://localhost:8000/docs](http://localhost:8000/docs) |
| **ReDoc** | [http://localhost:8000/redoc](http://localhost:8000/redoc) |

### Key Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Root — API welcome message |
| `GET` | `/health` | Health check for monitoring |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate & receive JWT token |
| `POST` | `/api/resume/upload` | Upload & analyze a resume (PDF/DOCX) |
| `POST` | `/api/resume/ats-score` | Score resume against a job description |
| `GET` | `/api/interview/start` | Start an AI mock interview session |
| `POST` | `/api/interview/evaluate` | Evaluate an interview answer |
| `GET` | `/api/roadmap/generate` | Generate a personalized learning roadmap |
| `GET` | `/api/career-twin/simulate` | Simulate future career trajectories |
| `GET` | `/api/crs/calculate` | Calculate Career Readiness Score |

---

## 🗺️ Development Roadmap

The project is being developed in **3 phases** across **12 weeks**:

### Phase 1 — Foundation (Weeks 1–4)
- [x] Project setup, Docker configuration, CI/CD scaffolding
- [x] Database models (User, Resume, Interview, Career Profile)
- [x] JWT authentication (Register / Login)
- [x] Backend project structure & configuration
- [ ] Resume parsing agent (PDF/DOCX → structured data)
- [ ] ATS Scorer agent (resume vs. job description scoring)

### Phase 2 — Core Intelligence (Weeks 5–8)
- [ ] Skill Gap analysis agent with RAG
- [ ] Learning Roadmap generation agent
- [ ] AI Mock Interview agent (text + voice modes)
- [ ] RAG pipeline integration (ChromaDB + sentence-transformers)

### Phase 3 — Advanced Features (Weeks 9–12)
- [ ] Career Readiness Score (CRS) agent with composite scoring
- [ ] Career Twin simulation agent
- [ ] LangGraph Orchestrator (full state graph with routing)
- [ ] Next.js frontend development
- [ ] End-to-end testing & deployment

---

## 🧪 Running Tests

```bash
cd backend
pytest tests/ -v
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get involved:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow [PEP 8](https://pep8.org/) style conventions
- Write docstrings for all public functions and classes
- Add tests for new features in the `tests/` directory
- Keep commits atomic and descriptive

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License · Copyright (c) 2026 Mudassar Gill
```

---

## 👤 Author

**Mudassar Gill**
- GitHub: [@MudassarGill](https://github.com/MudassarGill)

---

<p align="center">
  Built with ❤️ using FastAPI · LangGraph · Google Gemini · ChromaDB
</p>
