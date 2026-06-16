"""
============================================================
CareerPilot AI — Pydantic Schemas (Request/Response Models)
============================================================
This package contains Pydantic models that define the shape
of data flowing in and out of the API. They handle:

    - Request validation (incoming JSON bodies)
    - Response serialization (outgoing JSON)
    - Data documentation (auto-generated in Swagger UI)

Files:
    - user.py      → UserCreate, UserLogin, UserResponse
    - resume.py    → ResumeUpload, ATSScoreResponse
    - interview.py → InterviewStart, AnswerSubmit, FeedbackResponse
    - roadmap.py   → RoadmapRequest, RoadmapResponse
    - career.py    → CRSResponse, CareerTwinRequest

Note: Schemas are separate from Models. Models = DB tables,
Schemas = API contracts (what the client sends/receives).
============================================================
"""
