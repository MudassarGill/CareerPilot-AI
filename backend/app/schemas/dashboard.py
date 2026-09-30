from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict
from datetime import datetime

class DashboardSummaryResponse(BaseModel):
    # Core scores
    readiness_score: float
    readiness_trend: int # e.g. +5 or -2 compared to last score
    
    # Role context
    target_role: Optional[str]
    current_level: Optional[str]
    
    # Breakdown module stats
    resume_status: Optional[str]
    resume_score: Optional[float]
    
    interview_count_audio: int
    interview_count_video: int
    interview_avg: Optional[float]
    
    learning_progress_pct: int
    
    skill_progress_pct: int
    
    model_config = ConfigDict(from_attributes=True)
