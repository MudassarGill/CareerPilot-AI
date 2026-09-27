# 🚀 CareerPilot AI 

CareerPilot AI is an advanced, AI-driven career coaching platform utilizing Next.js, FastAPI, PostgreSQL, and a multi-agent AI Orchestrator architecture.

This project is currently in **Phase 1: Full Authentication Module**. The final product will feature a robust Micro-Agent AI ecosystem (RAG + Specialized Agents).

## 🏗 System Architecture (Full Platform Vision)

The architecture is split into several interconnected layers:

### 1. Frontend Layer (Next.js, React, Tailwind CSS)
- **Features:** Authentication, Interactive Dashboard, Career Modules
- **Career Modules include:** AI Career Coach, Resume Intelligence, ATS Evaluation, Skill Gap Analysis, Learning Roadmap, and AI Mock Interviews (Audio & Video options).

### 2. Backend Layer (Python, FastAPI)
- Handles core routing and interactions for:
  - Auth Service & User Service
  - Resume & ATS Services
  - Skill, Roadmap, and Interview Services

### 3. AI Orchestrator & Agents Layer
- **Orchestrator:** Receives tasks, selects the appropriate AI agent, sends context, and combines the results.
- **Micro-Agents:** 
  - *Resume Agent*, *ATS Agent*, *Learning Agent*, *Interview Agent*
  - *Career Coach*, *Career Twin Agent*, *Automation Agent*, *Feedback Agent*
- **RAG & Models:** Uses Large Language Models alongside specialized CV and Speech AI Models to analyze and generate hyper-personalized feedback.

### 4. Data Layer
- **Relational DB (PostgreSQL):** Users, Profiles, Skills, CRS, Interviews, Career Twin.
- **File Storage:** Resume PDFs, Interview Videos, Audio, Reports, Agent Logs.
- **Vector Database (Embeddings):** Resume Embeddings, Job Embeddings, Skills, Resources for RAG queries.

---

## 🛠 Phase 1 Setup: Authentication Module

The Phase 1 release includes a fully functioning End-to-End JWT authentication flow featuring Login, Registration, JWT Tokens (Access/Refresh), and Email Verification capabilities.

### Prerequisites
- Python 3.10+
- Node.js & npm (v18+)
- PostgreSQL 15+ (Database must be named `career_ai_auth` and owned/granted to `career_ai_user`)

### Quick Start (Windows)
We've included an automated launcher that will migrate the DB and start both servers. Run this at the root of the project:

```bash
.\test.bat
```

### Manual Setup
**1. Database Migration:**
```bash
cd backend
alembic upgrade head
```

**2. Start Backend API (FastAPI):**
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```
*API Docs available at http://localhost:8000/docs*

**3. Start Frontend (Next.js):**
```bash
cd frontend
npm install
npm run dev
```
*Frontend available at http://localhost:3000*
