# 🚀 CareerPilot AI — Complete Production Deployment Guide ($0 / 100% Free Forever)

This comprehensive guide details everything you need to take **CareerPilot AI** from local development to a live, production-ready web application accessible to everyone worldwide — without spending a single dollar.

---

## 📋 Table of Contents
1. [The Big Question: Do We Need Docker?](#-the-big-question-do-we-need-docker)
2. [The $0 Production Architecture Stack](#-the-0-production-architecture-stack)
3. [What is Required for Production Readiness?](#-what-is-required-for-production-readiness)
4. [Step-by-Step Deployment Plan](#-step-by-step-deployment-plan)
   - [Phase 1: Free Cloud Database (Neon PostgreSQL)](#phase-1-free-cloud-database-neon-postgresql)
   - [Phase 2: Push Repository to GitHub](#phase-2-push-repository-to-github)
   - [Phase 3: Deploy Backend API (Render)](#phase-3-deploy-backend-api-render)
   - [Phase 4: Deploy Frontend (Vercel)](#phase-4-deploy-frontend-vercel)
   - [Phase 5: Link CORS & Free Keep-Alive Bot](#phase-5-link-cors--free-keep-alive-bot)
5. [Production Configuration Checklist](#-production-configuration-checklist)
6. [Troubleshooting & Pro Tips](#-troubleshooting--pro-tips)

---

## 🐳 The Big Question: Do We Need Docker?

### **Direct Answer: NO, you do NOT need Docker to deploy this project for free.**

Here is why:
1. **Modern Free Cloud Platforms are Already Containerized**:
   - **Vercel / Netlify**: Automatically detects your React + Vite frontend, builds it with Node, and serves it globally across Edge CDNs. You don't manage any servers or containers.
   - **Render / Koyeb / Railway**: Natively builds Python apps directly from your repository using standard `pip install` and `uvicorn`.
   - **Neon / Supabase**: Fully manages the PostgreSQL database in the cloud. You only need a connection string.
2. **Docker adds unnecessary friction for free hosting**:
   - Container images with heavy Python libraries (PyTorch, spaCy) can be several gigabytes in size. Pushing and pulling these images to Docker Hub on free tiers often runs into build-timeout and bandwidth limits.

### When would you use Docker?
- If you choose to host on your own VPS (DigitalOcean Droplet, AWS EC2, Linode, or Hetzner).
- If you use container-first hosting platforms like **Hugging Face Spaces (Docker)** or **Fly.io**.
- *Note:* We have updated your `backend/Dockerfile` to be 100% production-ready if you ever decide to deploy with Docker in the future.

---

## 🏗️ The $0 Production Architecture Stack

| Layer | Service | Free Tier Allowance | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** (or Netlify) | Unlimited bandwidth (fair use), global Edge CDN, free SSL | Hosts React + Vite Single Page Application |
| **Backend API** | **Render.com** (or Koyeb) | Free Web Service (512MB RAM, shared CPU), free SSL | Runs FastAPI & Uvicorn application |
| **Database** | **Neon.tech** (or Supabase) | 0.5 GB PostgreSQL storage, auto-scaling, SSL connection | Relational DB for users, sessions, resumes, jobs |
| **AI / LLM** | **Google Gemini AI Studio** | Generous free tier (15 requests/min for Gemini Flash) | Drives Multi-Agent Intelligence & LangGraph |
| **Keep-Alive** | **UptimeRobot** | 50 free monitors, pings every 5–15 mins | Prevents free backend from sleeping |
| **Total Cost** | **$0.00 / month forever** | — | **100% Free** |

---

## 🔍 What is Required for Production Readiness?

Before going live, the following critical production requirements have been prepared in your codebase:

1. **Dynamic CORS Configuration (`backend/app/main.py`)**:
   - In production, your frontend (`https://careerpilot.vercel.app`) must have permission to make requests to your backend (`https://careerpilot-backend.onrender.com`).
   - We updated `backend/app/main.py` so it automatically permits requests from your production `FRONTEND_URL` without crashing.

2. **Client-Side Routing / SPA Rewrites (`careerpilot/vercel.json` & `public/_redirects`)**:
   - In React SPAs, refreshing pages like `/login` or `/dashboard` triggers a 404 error on static servers unless rewrites are configured.
   - We created `careerpilot/vercel.json` and `careerpilot/public/_redirects` to route all page requests to `index.html`.

3. **Lightweight Production Dependencies (`backend/requirements-prod.txt`)**:
   - Free backend tiers (like Render) have **512 MB RAM** limits.
   - Unused heavy packages like full Whisper models and offline PyTorch can cause build timeouts or memory crashes on free tiers.
   - We generated `requirements-prod.txt` with essential packages (FastAPI, SQLAlchemy, LangChain, Google GenAI, PyMuPDF, etc.) for fast 30-second builds that easily fit within memory limits.

4. **Automatic Database Table Creation**:
   - `backend/app/main.py` already includes an `on_event("startup")` hook that automatically creates all database tables (`Base.metadata.create_all(bind=engine)`) and default skills upon startup. No complex manual migrations are required.

5. **Port Binding**:
   - Cloud platforms dynamically inject a `$PORT` environment variable (e.g. 10000 on Render).
   - Your production startup command binds to `0.0.0.0` and uses the cloud-assigned port.

---

## 🚀 Step-by-Step Deployment Plan

```mermaid
flowchart LR
    A[Code on GitHub] --> B[Vercel Frontend]
    A --> C[Render Backend]
    C --> D[(Neon PostgreSQL Cloud)]
    C --> E[Google Gemini API]
    B -- API Requests --> C
    F[UptimeRobot Free Ping] -. Keep Awake .-> C
```

---

### Phase 1: Free Cloud Database (Neon PostgreSQL)

1. Go to **[Neon.tech](https://neon.tech)** and sign up with your GitHub or Google account (100% free, no credit card required).
2. Click **Create Project**:
   - Name: `careerpilot-db`
   - Region: Select the region closest to you (e.g., US East, Europe, or Asia).
   - Postgres version: **16** (recommended).
3. Once created, you will see your **Connection Details**:
   - Select **Connection string** > **Direct connection** (or pooled).
   - It will look like:
     ```text
     postgresql://neondb_owner:AbCdEf123456@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
4. **Copy this string** — you will use it as your `DATABASE_URL` in Render.

---

### Phase 2: Push Repository to GitHub

Ensure your latest code is committed and pushed to a GitHub repository:

```bash
# In the root folder: C:\Users\Hp EliteBook\Desktop\CareerPilot-AI
git add .
git commit -m "Prepare CareerPilot AI for free production deployment"
git push origin main
```

*(Note: Verify that `.env` is ignored by `.gitignore` so your local credentials remain secure).*

---

### Phase 3: Deploy Backend API (Render)

1. Go to **[Render.com](https://render.com)** and sign up with GitHub.
2. Click **New +** and select **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect your `CareerPilot-AI` repository.
4. Fill in the service configuration:
   - **Name**: `careerpilot-backend` (or a name of your choice)
   - **Region**: Choose the same region or nearest to your Neon database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r requirements-prod.txt
     ```
   - **Start Command**:
     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: Select **Free** (0.5 CPU, 512 MB RAM)
5. Scroll down to **Environment Variables** and add the following keys:

| Key | Recommended Value | Note |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://neondb_owner:...@...neon.tech/neondb?sslmode=require` | Your Neon database string |
| `SECRET_KEY` | *(A random 32-character string)* | e.g. run `openssl rand -hex 32` or type a secure random string |
| `ALGORITHM` | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `43200` | 30 days token expiry |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `30` | 30 days refresh expiry |
| `GEMINI_API_KEY` | `AIzaSy...` | Your Google Gemini API Key |
| `GOOGLE_API_KEY` | `AIzaSy...` | Same Gemini key for LangChain compatibility |
| `FRONTEND_URL` | `http://localhost:5173` | *(Temporary; update in Phase 5 with your live Vercel URL)* |
| `DEBUG` | `False` | Disable debug mode in production |

6. Click **Create Web Service**.
7. Render will install dependencies and start the server. Within 1–2 minutes, you will see:
   ```text
   [INFO] Connected to PostgreSQL database successfully.
   [INFO] CareerPilot AI database tables verified/initialized.
   Application startup complete.
   ```
8. **Copy your Backend URL** from the top of the Render dashboard:
   - Example: `https://careerpilot-backend.onrender.com`
   - Test it by visiting `https://careerpilot-backend.onrender.com/health` in your browser. It should return `{"status":"healthy","service":"CareerPilot AI Backend"}`!

---

### Phase 4: Deploy Frontend (Vercel)

1. Go to **[Vercel.com](https://vercel.com)** and sign up with your GitHub account.
2. Click **Add New...** > **Project**.
3. Import your `CareerPilot-AI` GitHub repository.
4. Configure the project settings:
   - **Project Name**: `careerpilot-ai`
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select `careerpilot` (important!)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
5. Expand **Environment Variables**:
   - Name: `VITE_API_URL`
   - Value: `https://careerpilot-backend.onrender.com` *(Paste your Render backend URL from Phase 3, without a trailing slash)*
6. Click **Deploy**.
7. In about 30–45 seconds, Vercel will complete the build and give you a live domain:
   - Example: `https://careerpilot-ai.vercel.app`

---

### Phase 5: Link CORS & Free Keep-Alive Bot

#### 1. Update Backend CORS Origin:
- Go back to your **Render.com** Dashboard > `careerpilot-backend` > **Environment**.
- Update `FRONTEND_URL` with your live Vercel address:
  - `FRONTEND_URL` = `https://careerpilot-ai.vercel.app`
- Click **Save Changes**. Render will automatically redeploy with the updated CORS rule in seconds.

#### 2. Prevent Free-Tier Cold Starts (Free Keep-Alive Bot):
*On Render's free tier, backend instances go to sleep after 15 minutes of inactivity. When a new visitor arrives, it can take 20–40 seconds to "wake up".*

To keep your backend awake 24/7 for free:
1. Go to **[UptimeRobot.com](https://uptimerobot.com)** (100% free account).
2. Click **Add New Monitor**:
   - **Monitor Type**: `HTTP(s)`
   - **Friendly Name**: `CareerPilot Backend Ping`
   - **URL**: `https://careerpilot-backend.onrender.com/health`
   - **Monitoring Interval**: `Every 10 minutes` (or 14 minutes)
3. Click **Create Monitor**.
4. UptimeRobot will ping your backend every 10 minutes, keeping your Render free service warm and instant for all visitors!

---

## 🔒 Production Configuration Checklist

Before announcing your project to users, verify this final checklist:

- [x] **Secure JWT Secret**: Ensure `SECRET_KEY` on Render is a long random string, not the default `"change-me-in-production"`.
- [x] **Environment Isolation**: `.env` is omitted from Git commits.
- [x] **CORS Permitted**: `FRONTEND_URL` matches the deployed Vercel domain.
- [x] **SPA Page Reloads**: `vercel.json` and `_redirects` are in place so direct links to `/dashboard` do not return 404.
- [x] **Database Auto-Seeded**: Tables and standard skills are created on first startup.
- [x] **Free Keep-Alive Setup**: UptimeRobot monitor pinging `/health`.

---

## 🛠️ Troubleshooting & Pro Tips

### 1. "Failed to fetch" or CORS Error in Frontend Console
- **Cause**: The backend is rejecting requests from your frontend domain.
- **Fix**: Check `FRONTEND_URL` on Render. Make sure it matches your Vercel URL exactly (e.g. `https://careerpilot-ai.vercel.app`) with **no trailing slash**.

### 2. Database Connection Error on Render
- **Cause**: Neon requires SSL mode.
- **Fix**: Ensure your `DATABASE_URL` ends with `?sslmode=require`.

### 3. Backend Takes 30 Seconds to Respond on First Visit
- **Cause**: Render free tier went to sleep after inactivity.
- **Fix**: Setup the free UptimeRobot monitor (Phase 5) to ping `/health` every 10 minutes.

### 4. File Uploads (Resumes & Avatars) in Cloud
- On Render free tier, the local file system is ephemeral (files reset if the server restarts).
- For long-term production resume storage at $0:
  - You can connect **Supabase Storage** (1 GB free storage) or **Cloudinary** (25 GB free storage) for permanent media uploads.

