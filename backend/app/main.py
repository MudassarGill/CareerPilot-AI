"""
============================================================
CareerPilot AI — FastAPI Application Entry Point
============================================================
This is the main entry point for the CareerPilot AI backend.
It initializes the FastAPI application, configures middleware
(CORS, authentication), and registers all API route handlers.

Key Responsibilities:
    - Create and configure the FastAPI app instance
    - Set up CORS middleware for frontend communication
    - Register API routers for each feature module
    - Define health-check and root endpoints
    - Handle application startup/shutdown events

Usage:
    uvicorn app.main:app --reload --port 8000
============================================================
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

# ---- Initialize FastAPI Application ----
app = FastAPI(
    title="CareerPilot AI",
    description=(
        "Multi-Agent Career Intelligence, Simulation, and Automation Platform. "
        "Powered by Generative AI, LangGraph, RAG, and Career Analytics."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---- CORS Middleware ----
# Allows the Next.js frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- Health Check Endpoint ----
@app.get("/", tags=["Health"])
async def root():
    """
    Root endpoint — returns a welcome message and confirms
    the API is running.
    """
    return {
        "message": "🚀 CareerPilot AI API is running!",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint for monitoring and Docker health probes.
    Returns the current status of the application.
    """
    return {"status": "healthy", "service": "CareerPilot AI Backend"}


# ============================================================
# API Router Registration
# ============================================================
# Each feature module has its own router. They are imported
# and registered here to keep the main file clean.
#
# TODO: Uncomment these as each module is implemented:
#
# from app.api.auth import router as auth_router
# from app.api.resume import router as resume_router
# from app.api.interview import router as interview_router
# from app.api.roadmap import router as roadmap_router
# from app.api.career_twin import router as career_twin_router
# from app.api.crs import router as crs_router
#
# app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
# app.include_router(resume_router, prefix="/api/resume", tags=["Resume"])
# app.include_router(interview_router, prefix="/api/interview", tags=["Interview"])
# app.include_router(roadmap_router, prefix="/api/roadmap", tags=["Roadmap"])
# app.include_router(career_twin_router, prefix="/api/career-twin", tags=["Career Twin"])
# app.include_router(crs_router, prefix="/api/crs", tags=["Career Readiness"])
# ============================================================
