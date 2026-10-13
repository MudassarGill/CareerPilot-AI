# CareerPilot AI — Phase 1: Authentication Phase

Welcome to **CareerPilot AI**! This repository contains the full stack implementation of CareerPilot AI, beginning with **Phase 1: Authentication & Authorization**.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4
- **Backend**: FastAPI, Python 3.10+, SQLAlchemy 2.0, Pydantic, Passlib (Bcrypt), JWT (python-jose)
- **Database**: PostgreSQL (with SQLite auto-fallback for local development)

---

## 🗄️ Database Setup & Credentials

- **Target Database Name**: `career_ai_authication`
- **Default Port**: `5432`
- **Configuration File**: `backend/.env`

### 1. Grant Permissions in PostgreSQL (pgAdmin)
In **pgAdmin Query Tool**, run:

```sql
GRANT ALL ON SCHEMA public TO career_ai_user;
GRANT ALL PRIVILEGES ON DATABASE career_ai_authication TO career_ai_user;
```

### 2. Configure Credentials in `backend/.env`
Ensure your database connection string in `backend/.env` is configured:

```env
DATABASE_URL=postgresql://career_ai_user:Mudassar1565%40@localhost:5432/career_ai_authication
SECRET_KEY=careerpilot-ai-super-secret-key-2026
DEBUG=True
FRONTEND_URL=http://localhost:5173
```

> **Note:** If `career_ai_auth` has not yet been created, the backend will safely fallback to local SQLite (`career_ai.db`) so you can test registration and login immediately without blocking.

---

## 🚀 Running the Project Locally

### 1. Start the Backend API (FastAPI)

In your terminal:

```powershell
cd backend
uvicorn app.main:app --reload --port 8000
```

- API Base URL: `http://localhost:8000`
- Interactive Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

---

### 2. Start the Frontend (Vite + React)

In a second terminal:

```powershell
cd careerpilot
npm run dev
```

- Application URL: [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure (Phase 1)

```
CareerPilot-AI/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth.py         # Login, Register, Me endpoints
│   │   ├── db/
│   │   │   └── database.py     # SQLAlchemy engine & session factory
│   │   ├── models/
│   │   │   └── user.py         # User ORM model
│   │   ├── schemas/
│   │   │   └── user.py         # Request/Response schemas
│   │   └── main.py             # FastAPI entry point
│   ├── .env                    # Database & auth configuration
│   └── requirements.txt
│
├── careerpilot/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── background.jpg  # Full-screen auth background
│   │   │   └── logo.jpg        # CareerPilot AI logo
│   │   ├── Components/
│   │   │   └── Auth/
│   │   │       ├── AuthLayout.jsx      # Auth wrapper with background
│   │   │       ├── SignUpLayout.jsx    # Register wrapper with background
│   │   │       ├── BrandingPanel.jsx   # Left glassmorphic brand panel
│   │   │       ├── AuthFrom.jsx        # Login form with animated title
│   │   │       └── SignUpFrom.jsx      # Registration form
│   │   ├── services/
│   │   │   └── auth.js         # API integration client
│   │   ├── App.jsx             # Main application state router
│   │   └── index.css           # Design tokens & sweeping color animation
│   └── vite.config.js          # Vite config with /api proxy
│
└── README.md
```

---

## ✨ Features Implemented in Phase 1

1. **Authentication Flow**:
   - User Registration (`/api/auth/register`)
   - User Login with JWT Token generation (`/api/auth/login`)
   - Password strength validation & confirmation check
   - Show/Hide password toggle buttons

2. **Design & Aesthetics**:
   - Full viewport background image (`background.jpg`) with translucent dark overlay
   - Glassmorphic branding panel with polygonal clip-path
   - Smooth left-to-right alternating color sweep animation on **"Welcome Back"** / **"Create Account"**
   - Responsive layout adapting from mobile screens to wide monitors
   - Animated phase 1 authenticated preview card with logout functionality
