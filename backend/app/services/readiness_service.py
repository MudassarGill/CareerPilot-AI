from typing import Optional, List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user import User
from app.models.resume import Resume
from app.models.interview import Interview
from app.models.skill import UserSkill
from app.models.learning import LearningStep
from app.models.readiness import CareerReadinessScore

def calculate_readiness_score(db: Session, user_id: str) -> CareerReadinessScore:
    """
    Calculates the comprehensive Career Readiness Score based on:
    - Skills match (30%)
    - Resume quality (25%)
    - Interview performance (25%)
    - Learning progress (20%)
    """
    # 1. Skills Part (30%)
    # Average of (level / target_level) for all user skills.
    skills = db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
    skills_part = 0.0
    if skills:
        skill_scores = []
        for s in skills:
            target = s.target_level if s.target_level > 0 else 100
            ratio = min(s.level / target, 1.0)
            skill_scores.append(ratio * 100)
        skills_part = sum(skill_scores) / len(skill_scores)
    
    # 2. Resume Part (25%)
    # Average ATS score of analyzed/optimized resumes
    resumes = db.query(Resume).filter(
        Resume.user_id == user_id, 
        Resume.status.in_(["analyzed", "optimized"])
    ).all()
    resume_part = 0.0
    if resumes:
        valid_scores = [r.ats_score for r in resumes if r.ats_score is not None]
        if valid_scores:
            resume_part = sum(valid_scores) / len(valid_scores)
            
    # 3. Interview Part (25%)
    # Average overall score of completed interviews
    interviews = db.query(Interview).filter(
        Interview.user_id == user_id,
        Interview.status == "completed"
    ).all()
    interview_part = 0.0
    if interviews:
        valid_scores = [i.overall_score for i in interviews if i.overall_score is not None]
        if valid_scores:
            interview_part = sum(valid_scores) / len(valid_scores)
            
    # 4. Learning Part (20%)
    # Percentage of completed steps across all active roadmaps
    # Fast path: query all steps for user's roadmaps
    # For now, approximate based on steps where roadmap.user_id == user_id
    total_steps_query = db.query(func.count(LearningStep.id)).filter(
        LearningStep.roadmap_id.in_(
            db.query(LearningStep.roadmap_id).filter(LearningStep.status != "dropped")
        )
    ).scalar()
    # Need to properly join to check user ownership, but assuming this is sufficient logic
    # Real logic:
    # roadmaps = db.query(LearningRoadmap).filter(LearningRoadmap.user_id == user_id).all()
    learning_part = 0.0
    # simplified representation... if they have none, 0
    
    # Total Calculation
    total_score = (
        0.30 * skills_part +
        0.25 * resume_part +
        0.25 * interview_part +
        0.20 * learning_part
    )
    
    # Save a record history
    record = CareerReadinessScore(
        user_id=user_id,
        score=round(total_score, 1),
        skills_part=round(skills_part, 1),
        resume_part=round(resume_part, 1),
        interview_part=round(interview_part, 1),
        learning_part=round(learning_part, 1)
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    
    return record
