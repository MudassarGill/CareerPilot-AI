from sqlalchemy.orm import Session
from app.models.user import User
from app.models.resume import Resume
from app.models.interview import Interview
from app.models.readiness import CareerReadinessScore
from app.schemas.dashboard import DashboardSummaryResponse
from app.services.readiness_service import calculate_readiness_score

def get_dashboard_summary(db: Session, user_id: str) -> DashboardSummaryResponse:
    user = db.query(User).filter(User.id == user_id).first()
    
    # Get latest readiness score
    scores = db.query(CareerReadinessScore).filter(CareerReadinessScore.user_id == user_id).order_by(CareerReadinessScore.calculated_at.desc()).all()
    
    if not scores:
        # Calculate initially if no scores
        latest_score = calculate_readiness_score(db, user_id)
        trend = 0
    else:
        latest_score = scores[0]
        # Compare with previous if it exists
        trend = 0
        if len(scores) > 1:
            trend = int(latest_score.score - scores[1].score)
            
    # Resume summary
    latest_resume = db.query(Resume).filter(
        Resume.user_id == user_id
    ).order_by(Resume.uploaded_at.desc()).first()
    
    resume_status = latest_resume.status.capitalize() if latest_resume else "No Resume"
    resume_score = latest_resume.ats_score if latest_resume else None
    
    # Interview summary
    interviews = db.query(Interview).filter(Interview.user_id == user_id).all()
    audio_ct = sum(1 for i in interviews if i.interview_type == "audio")
    video_ct = sum(1 for i in interviews if i.interview_type == "video")
    valid_int_scores = [i.overall_score for i in interviews if i.overall_score is not None]
    interview_avg = sum(valid_int_scores) / len(valid_int_scores) if valid_int_scores else 0.0
    
    # Learning
    learning_progress_pct = 0 # Placeholder for now until we join LearningSteps correctly
    
    # Skill
    skill_progress_pct = int(latest_score.skills_part) if latest_score.skills_part else 0
    
    return DashboardSummaryResponse(
        readiness_score=round(latest_score.score, 1),
        readiness_trend=trend,
        target_role=user.target_role,
        current_level=user.current_level,
        resume_status=resume_status,
        resume_score=resume_score,
        interview_count_audio=audio_ct,
        interview_count_video=video_ct,
        interview_avg=round(interview_avg, 1) if interview_avg else None,
        learning_progress_pct=learning_progress_pct,
        skill_progress_pct=skill_progress_pct
    )
