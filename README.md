# CareerPilot AI - Master System Architecture & Technical Documentation

CareerPilot AI is an enterprise-grade, multi-agent career acceleration, intelligence, and autonomous application platform. Built with a FastAPI Python backend, PostgreSQL database, and modern React 19 / Vite frontend, it integrates multi-agent AI systems for resume intelligence, dynamic roadmaps, real-time mock interviews with browser speech recognition, live tech job matching, multi-year career simulations, and an autonomous application Kanban pipeline with cover letter generation.

---

## 1. Master Architecture & Phases Status

All 8 development phases are built, integrated, tested, and operational:

| Phase | Module Name | Status | Key Deliverables & Capabilities |
| :--- | :--- | :---: | :--- |
| **Phase 1** | **Authentication & Security Engine** | **Complete** | JWT token authentication, bcrypt password hashing, PostgreSQL persistence with SQLite fallback, animated auth modal with sign-in and sign-up flows. |
| **Phase 2** | **Core Dashboard & Navigation** | **Complete** | Fixed luxury dark top navbar, profile manager, responsive metric summary cards, quick navigation routes, responsive design. |
| **Phase 3** | **Shared Features & Reactive System** | **Complete** | Reactive notifications drawer with instant badge count clearance, About Us view, interactive FAQs, Contact Support form, Terms & Privacy policy, modern footer. |
| **Phase 4** | **Resume & ATS Intelligence** | **Complete** | PDF/DOCX multi-section parser (education, experience, skills), job description ATS scoring, action-verb and quantified metric audit, instant printable A4 PDF export report. |
| **Phase 5** | **Skills, Roadmap & Job Matcher** | **Complete** | 200+ competency catalog, target role gap analyzer, 4-stage interactive milestone roadmap, weekly completion checklist, and automated Job Intelligence Matcher connecting live tech openings with ATS fit and missing skill alerts. |
| **Phase 6** | **AI Mock Interview Simulator** | **Complete** | Role-tailored situational question banks, browser Web Speech Text-to-Speech audio, real-time voice speech recognition dictation, WebRTC webcam preview mirror, multi-dimensional rubric feedback, Career Readiness Score (CRS) synchronization, and printable PDF transcript export. |
| **Phase 7** | **Career Twin & Simulation Engine** | **Complete** | Deterministic multi-year career projection engine (1-yr, 3-yr, 5-yr horizons), regional salary benchmarks, dynamic 5-year compensation curve visualization, 3 What-If branch comparison scenarios (Management, Deep Tech Specialization, Startup Founder), and instant printable A4 PDF simulation forecast report. |
| **Phase 8** | **Autonomous Application Pipeline** | **Complete** | 5-stage Kanban recruitment board (Wishlist, Applied, Interviewing, Offer, Archived), live posting deep-links, 1-click tailored AI cover letter generator with customizable tone, and copy/export actions. |

---

## 2. Technical Deep Dive: How Everything Works Under the Hood

### A. Audio Text-to-Speech (TTS) Engine
- **Underlying Technology**: Browser Native **Web Speech API (`window.speechSynthesis`)**.
- **How it Works**:
  1. When an interview question loads in the Interview Studio, the `speakQuestion(text)` handler checks if browser speech synthesis is supported.
  2. It initializes a `SpeechSynthesisUtterance(text)` instance, selecting a natural English voice (`en-US` or `en-GB`), setting speech rate to `1.0` and pitch to `1.0`.
  3. The browser plays the synthesized question aloud without sending audio requests over the network, ensuring zero latency, zero third-party subscription costs, and offline availability.

### B. Live Voice Speech Recognition & Transcription
- **Underlying Technology**: Browser Native **Web Speech Recognition API (`window.SpeechRecognition || window.webkitSpeechRecognition`)**.
- **How it Works**:
  1. When the candidate clicks "Start Voice Dictation" or speaks during an interview, the browser requests microphone access.
  2. The recognition engine runs with `continuous = true` and `interimResults = true`.
  3. Spoken audio is converted into text chunks in real-time. Final transcripts are appended into the answer buffer (`answerText`), allowing hands-free voice answering.
  4. Pacing metrics (Words Per Minute / WPM) are continuously measured by tracking word count against elapsed timer seconds.

### C. WebRTC Local Camera Stream (Video Mirror)
- **Underlying Technology**: **WebRTC MediaDevices API (`navigator.mediaDevices.getUserMedia`)**.
- **How it Works**:
  1. When the candidate selects Video mode, the browser calls `getUserMedia({ video: true, audio: true })`.
  2. The camera feed is piped directly into an HTML5 `<video autoPlay playsInline muted />` element.
  3. **Privacy Assurance**: The video stream is processed strictly in the candidate's browser memory. No camera frames or video recordings are transmitted to or stored on the backend server, maintaining candidate privacy and eliminating bandwidth overhead.

### D. Resume & ATS Parser
- **Underlying Technology**: Python `PyMuPDF` (`fitz`), `python-docx`, and regex entity extractors.
- **How it Works**:
  1. Candidate uploads a PDF or DOCX file up to 5MB via `POST /api/resume/upload`.
  2. `PyMuPDF` extracts clean text streams page by page, preserving layout order.
  3. Regex pattern matchers identify structural sections: Contact Information (Email, Phone, LinkedIn), Education, Professional Experience, Technical Skills, Projects, and Summary.
  4. Parsed sections are stored as structured JSON in PostgreSQL (`Resume.parsed_data`) for immediate scoring against open market vacancies.

### E. ATS Match & Quality Power Audit
- **Underlying Technology**: NLP Terminology Matrix, Cosine/Jaccard Keyword Intersection.
- **How it Works**:
  1. Compares parsed resume keywords against target Job Descriptions (`POST /api/resume/match-jd`).
  2. Computes the **Match Percentage** based on required technical terms vs candidate competencies.
  3. **Action-Verb Density Check**: Scans bullet points for high-impact verbs (e.g., *architected, spearheaded, orchestrated, optimized*).
  4. **Quantified Metrics Extraction**: Detects quantifiable results (e.g., *30% latency reduction, $1.2M pipeline, 99.99% uptime*), providing actionable guidance to improve recruiter callback rates.

### F. Career Readiness Score (CRS) Engine
- **Formula & Weights**:
  $$\text{CRS} = (\text{Resume ATS} \times 0.35) + (\text{Skills Profile} \times 0.30) + (\text{Mock Interview} \times 0.25) + (\text{Roadmap Progress} \times 0.10)$$
- **Tiers**:
  - `90% - 100%`: Elite Ready (Top 5% Benchmark)
  - `75% - 89%`: Strong Candidate (Top 15% Benchmark)
  - `50% - 74%`: Competitive Profile (Top 35% Benchmark)
  - `< 50%`: Developing Foundation
- **Persistence**: Recalculated dynamically on resume uploads, skill selections, milestone checklist completions, and interview completions, persisting to PostgreSQL `CareerProfile.crs_score`.

### G. Job Intelligence Matcher & Live Deep-Links
- **Underlying Technology**: Curated High-Growth Tech Catalog + Candidate Profile Intersection.
- **How it Works**:
  1. Evaluates live tech positions (Anthropic, Vercel, ScaleAI, Stripe ecosystem, CNCF, Snowflake, Figma, Datadog) against the candidate's verified skills and resume keywords.
  2. Renders **Matching Skills** (green) and **Missing Skills** (orange) with personalized match percentages.
  3. **Direct Live Posting Links**: Includes role-specific deep-links to active vacancy postings (`https://www.linkedin.com/jobs/search/?keywords=...`), enabling candidates to verify real active hiring pipelines.
  4. **1-Click Application Checklist**: Generates custom resume tailoring keywords and technical interview prep guidelines for the role.

### H. Career Twin & Multi-Year Simulation Engine
- **Underlying Technology**: Deterministic Compensation Regression Modeling & Multipliers.
- **How it Works**:
  1. Models career progression across 1-Year, 3-Year, and 5-Year horizons based on target role, ambition pace, and regional market.
  2. **Regional Multipliers**: US Tech Hubs (1.25x), US Remote (1.05x), Europe (0.88x), APAC (0.82x), Latin America (0.65x).
  3. **Pace Multipliers**: Steady (1.0x), Accelerated (1.15x), Executive (1.28x).
  4. **Dynamic 5-Year Compensation Curve**: Generates 6-point progression data (Y0 to Y5) separating base compensation from stock/equity incentives.
  5. **What-If Career Matrix**: Provides side-by-side trade-off analysis across Engineering Management, Deep Tech Specialization, and Startup Founder branches.

### I. Autonomous Application Pipeline & AI Cover Letter Generator
- **Underlying Technology**: 5-Stage Kanban State Machine + Profile Synthesis Agent.
- **How it Works**:
  1. Manages candidate opportunities across 5 stages: **Wishlist**, **Applied**, **Interviewing**, **Offer**, and **Archived**.
  2. Quick stage transition selector updates backend state via `PUT /api/applications/{id}`.
  3. **Cover Letter Generator** (`POST /api/applications/generate-cover-letter`): Synthesizes candidate's verified technical skills, career highlights, and company name to craft a tailored, high-converting letter in Professional, Enthusiastic, or Executive tone.

### J. Client-Side Printable A4 PDF Report Generation
- **Underlying Technology**: In-browser `@media print` CSS engine with structured HTML DOM trees.
- **How it Works**:
  1. Generates clean A4 document markup formatted with typography, tabular data, and badges.
  2. Opens an isolated print preview window and triggers native browser printing (`window.print()`).
  3. Candidates can save reports directly as high-resolution PDFs without relying on heavy server-side headless browsers like Puppeteer.

---

## 3. Technology Stack

- **Frontend**: React 19, Vite, Modern Vanilla CSS Design System, Web Speech API (TTS & STT), WebRTC MediaDevices.
- **Backend**: FastAPI (Python 3.10+), SQLAlchemy 2.0 ORM, Pydantic v2 Settings, PyMuPDF, python-docx, Uvicorn.
- **Database**: PostgreSQL (`career_ai_authication`) with automatic SQLite fallback.
- **AI & Scoring**: Google Gemini API key support, ATS Keyword Matcher, Rubric Scorer, Multi-Year Career Twin Agent, Cover Letter Agent, Career Readiness Score (CRS) Engine.

---

## 4. Local Setup & Execution Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ (with npm)
- PostgreSQL running on port 5432 (default user: `career_ai_user`)

---

### Step 1: Backend Setup (FastAPI)

1. Open a terminal and navigate to the backend folder:
   ```powershell
   cd backend
   ```

2. (Optional) Activate Python virtual environment:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

3. Install backend dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

4. Configure Environment Variables (`backend/.env`):
   ```env
   PROJECT_NAME="CareerPilot AI"
   VERSION="1.0.0"
   DEBUG=True

   # Database Connection
   DATABASE_URL=postgresql://career_ai_user:Mudassar1565%40@localhost:5432/career_ai_authication

   # JWT Authentication Secret
   SECRET_KEY=careerpilot-ai-super-secret-key-2026
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=43200
   REFRESH_TOKEN_EXPIRE_DAYS=30

   # Frontend Origin
   FRONTEND_URL=http://localhost:5173

   # Google Gemini API Key
   # https://aistudio.google.com/app/apikey
   GEMINI_API_KEY=your_gemini_api_key_here
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

5. Launch the FastAPI backend server:
   ```powershell
   uvicorn app.main:app --reload --port 8000
   ```
   - API Base URL: `http://localhost:8000`
   - Interactive Swagger Documentation: `http://localhost:8000/docs`
   - Health Check: `http://localhost:8000/health`

---

### Step 2: Frontend Setup (React 19 / Vite)

1. Open a second terminal and navigate to the frontend directory:
   ```powershell
   cd careerpilot
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Launch development server:
   ```powershell
   npm run dev
   ```
   - Web Application URL: `http://localhost:5173`

4. Verify production bundle build:
   ```powershell
   npm run build
   ```

---

## 5. API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - User registration with bcrypt hashing
- `POST /api/auth/login` - OAuth2 password authentication returning JWT
- `GET /api/auth/me` - Validates current token and returns profile

### Resume & ATS Intelligence (`/api/resume`)
- `POST /api/resume/upload` - Upload and parse PDF/DOCX resumes
- `POST /api/resume/match-jd` - Compute ATS score against job description
- `GET /api/resume/latest` - Fetch most recently parsed resume

### Skills & Career Roadmap (`/api/skills`, `/api/roadmap`)
- `GET /api/skills/catalog` - List 200+ competencies by discipline
- `GET /api/skills/my-skills` - User's selected competencies
- `GET /api/roadmap` - Generate personalized 4-stage milestone roadmap
- `POST /api/roadmap/step/{id}/toggle` - Toggle step completion & update CRS

### Job Intelligence Matcher (`/api/jobs`)
- `GET /api/jobs` - List jobs with personalized match scores & live vacancy links
- `GET /api/jobs/summary` - Market readiness & top demanded skills
- `POST /api/jobs/save` - Bookmark / unbookmark a job
- `POST /api/jobs/apply` - Log application

### AI Mock Interview Studio (`/api/interview`)
- `POST /api/interview/start` - Initialize new interview session
- `POST /api/interview/answer` - Submit and evaluate candidate response
- `POST /api/interview/{id}/finish` - Complete interview and recalculate CRS
- `GET /api/interview/history` - List past interview sessions
- `GET /api/interview/{id}` - View complete interview transcript & feedback

### Career Twin & Simulation (`/api/career-twin`)
- `POST /api/career-twin/simulate` - Run multi-year career trajectory simulation
- `GET /api/career-twin/latest` - Retrieve most recent simulation state

### Application Pipeline & Cover Letter (`/api/applications`)
- `GET /api/applications` - List all tracked job applications
- `POST /api/applications` - Add a tracked application to pipeline
- `PUT /api/applications/{id}` - Update application stage, notes, or salary
- `DELETE /api/applications/{id}` - Remove tracked application
- `POST /api/applications/generate-cover-letter` - Generate role-tailored cover letter

### Career Readiness Score (`/api/crs`)
- `GET /api/crs/my-score` - Retrieve aggregated multi-factor CRS breakdown

---

## 6. Design System & User Constraints Adherence

- **Strictly No Emojis**: Modern, distraction-free typographic hierarchy with semantic CSS badges throughout all views.
- **Elevated Black Drop Shadows**: High-contrast, polished shadows (`box-shadow: 0 10px 26px -4px rgba(0, 0, 0, 0.16)`) applied consistently across all cards and interactive panels.
- **Pure CSS Components**: Zero broken external placeholder images; all visual gauges, progress bars, and badges are rendered natively.
- **Dynamic Timezone Greeting**: Dashboard greetings automatically compute in Pakistan Standard Time (`Asia/Karachi`, UTC+5) for accurate morning, afternoon, and evening greetings.
