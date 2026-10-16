# CareerPilot AI — Multi-Agent Career Intelligence & Automation Platform

Welcome to **CareerPilot AI**! CareerPilot AI is a production-ready, full-stack career acceleration platform combining multi-agent AI systems, ATS resume intelligence, dynamic learning roadmaps, real-time mock interviews, and career simulations.

---

## 🗺️ Master Architecture & Roadmap

| Phase | Module | Status | Highlights |
| :--- | :--- | :---: | :--- |
| **Phase 1** | **Authentication & Security** | ✅ **Complete** | JWT token authentication, secure password hashing (bcrypt), pgAdmin PostgreSQL connection, SQLite fallback, animated auth UI. |
| **Phase 2** | **Core Dashboard & Navbar** | ✅ **Complete** | Fixed luxury black navbar, profile settings, user avatars, responsive cards, 3 glowing metric highlight stat boxes. |
| **Phase 3** | **Shared Features & Support** | ✅ **Complete** | Notifications Drawer, About Us, Interactive FAQs, Contact Support form, Terms & Privacy Policy, modern footer. |
| **Phase 4** | **Resume & ATS Intelligence** | ✅ **Complete** | PDF/DOCX multi-section parser, job requirement compatibility scoring, action-verb & quantified metric power audit, and exportable ATS readiness report. |
| **Phase 5** | **Skills & Career Roadmap** | 🚀 **Live & Active** | 200+ industry verified skills catalog, target role gap analysis, personalized weekly milestone roadmap tracker, and dynamic Career Readiness Score (CRS). |
| **Phase 6** | **AI Mock Interview Simulator** | ⏳ *Scheduled Next* | Dynamic situational question banks, pacing analysis, answer evaluation, and scoring. |
| **Phase 7** | **Career Twin & Simulation** | ⏳ *Scheduled Next* | 1-to-5 year salary curves, promotion probability models, and what-if career projections. |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Vanilla Modern CSS Design System (Sleek black luxury navbar, glassmorphism, responsive SaaS cards)
- **Backend**: FastAPI, Python 3.10+, SQLAlchemy 2.0, Pydantic v2, PyMuPDF, python-docx
- **Database**: PostgreSQL (`career_ai_authication`) with automatic SQLite fallback
- **AI & Analytics**: Resume Analyzer Agent, ATS Scoring Agent, Skill Gap Agent, Roadmap Agent, Career Readiness Score (CRS) Engine

---

## 🚀 Running the Project Locally

### 1. Start the Backend API (FastAPI)

```powershell
cd backend
uvicorn app.main:app --reload --port 8000
```

- API Base URL: `http://localhost:8000`
- Interactive Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

### 2. Start the Frontend (Vite + React)

```powershell
cd careerpilot
npm run dev
```

- Application URL: [http://localhost:5173](http://localhost:5173)

---

## ✨ Features Implemented in Phase 4 & Phase 5

### 📄 Phase 4: Resume & ATS Analyzer
1. **Resume File Ingestion & Parsing**:
   - Supports PDF and DOCX files up to 5MB.
   - Automatically extracts sections: Education, Experience, Technical Skills, Projects, Summary, and Contact Info.
2. **ATS Job Compatibility Scanner**:
   - Compares parsed resumes against any pasted job description.
   - Calculates real-time percentage match score, matched keywords, missing keyword gaps, and section-by-section advice.
3. **AI Quality & Impact Audit**:
   - Inspects action-verb density and lists detected high-impact verbs.
   - Identifies measurable numeric achievements and percentage improvements.
   - Provides targeted AI suggestions to maximize recruiter callback rates.
4. **Exportable Summary Report**:
   - One-click downloadable `.txt` readiness report summarizing ATS match, quality breakdown, and actionable next steps.

### 🧭 Phase 5: Skills & Career Roadmap
1. **Curated Skills Catalog**:
   - 200+ industry verified competencies spanning Frontend, Backend, AI/ML, DevOps, Database, Cloud, and Soft Skills.
2. **Role Gap Analysis**:
   - Real-time benchmarking against target tech roles (Frontend, Backend, Full Stack, AI/ML Engineer, DevOps, Data Analyst).
   - Visual progress bar and dual-meter requirement indicators.
3. **Personalized Milestone Roadmap**:
   - Structured 4-stage progression: Core Foundations, Modern Frameworks, Real-World Projects & System Design, and Production Deployment.
   - Estimated completion hours per step and priority tags for bridging identified skill gaps.
   - Curated official documentation, interactive labs, and tutorial resources.
4. **Interactive Weekly Step Completion**:
   - Toggle step status (`pending`, `in_progress`, `done`).
   - Checking off completed learning steps directly triggers automatic recalculation of the user's **Career Readiness Score (CRS)**.
