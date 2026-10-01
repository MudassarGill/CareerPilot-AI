import os
import sys
import uuid
from datetime import datetime

# Make sure we can import from app
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '../..')))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.services.auth import hash_password
from app.models.user import User
from app.models.skill import Skill, UserSkill
from app.models.resume import Resume
from app.models.interview import Interview
from app.models.learning import LearningRoadmap, LearningStep
from app.services.readiness_service import calculate_readiness_score

def seed_database():
    db: Session = SessionLocal()
    try:
        # Create Demo User if not exists
        demo_email = "demo@careerpilot.ai"
        user = db.query(User).filter(User.email == demo_email).first()
        
        if not user:
            print("Creating demo user...")
            user = User(
                email=demo_email,
                hashed_password=hash_password("demo123"), # default easy password for testing
                name="Alex Parker",
                target_role="Senior Full Stack Engineer",
                current_level="Mid-Level",
                profile_completed=True,
                is_verified=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            print("Demo user already exists.")
            
        print(f"User ID: {user.id}")

        # Seed abstract Skills
        core_skills = [
            ("Python", "Programming"), ("React", "Frontend"), ("Next.js", "Frontend"),
            ("FastAPI", "Backend"), ("PostgreSQL", "Database"), ("System Design", "Architecture"),
            ("Docker", "DevOps"), ("AWS", "Cloud")
        ]
        
        print("Seeding Skills...")
        for skill_name, category in core_skills:
            skill = db.query(Skill).filter(Skill.name == skill_name).first()
            if not skill:
                skill = Skill(name=skill_name, category=category)
                db.add(skill)
                db.commit()
                db.refresh(skill)
                
            # Connect to user
            user_skill = db.query(UserSkill).filter(UserSkill.user_id == user.id, UserSkill.skill_id == skill.id).first()
            if not user_skill:
                # Give some variation in levels
                level = 80 if category in ["Programming", "Frontend"] else 60
                user_skill = UserSkill(
                    user_id=user.id,
                    skill_id=skill.id,
                    level=level,
                    target_level=90
                )
                db.add(user_skill)
        db.commit()

        # Resume
        print("Seeding Resume...")
        resume = db.query(Resume).filter(Resume.user_id == user.id).first()
        if not resume:
            resume = Resume(
                user_id=user.id,
                file_url="s3://dummy/alex_resume.pdf",
                original_name="Alex_Parker_Resume_2026.pdf",
                status="optimized",
                ats_score=88.5
            )
            db.add(resume)
            db.commit()

        # Interviews
        print("Seeding Interviews...")
        if db.query(Interview).filter(Interview.user_id == user.id).count() == 0:
            db.add_all([
                Interview(
                    user_id=user.id, role="Senior Full Stack Engineer", 
                    interview_type="audio", status="completed", overall_score=85.0
                ),
                Interview(
                    user_id=user.id, role="Senior Full Stack Engineer", 
                    interview_type="video", status="completed", overall_score=92.0
                ),
                Interview(
                    user_id=user.id, role="Backend Engineer", 
                    interview_type="text", status="completed", overall_score=78.0
                )
            ])
            db.commit()

        # Learning Roadmap
        print("Seeding Learning Roadmap...")
        roadmap = db.query(LearningRoadmap).filter(LearningRoadmap.user_id == user.id).first()
        if not roadmap:
            roadmap = LearningRoadmap(
                user_id=user.id,
                title="Path to Senior Full Stack Engineer",
                target_role="Senior Full Stack Engineer"
            )
            db.add(roadmap)
            db.commit()
            db.refresh(roadmap)
            
            steps = [
                ("Master Advanced React Patterns", "done"),
                ("Deploy Next.js on Vercel", "done"),
                ("FastAPI Async Database Integrations", "done"),
                ("System Design Fundamentals", "done"),
                ("Microservices Architecture", "done"),
                ("AWS Certified Developer", "done"),
                ("Distributed Caching", "in_progress"),
                ("Advanced PostgreSQL Optimization", "pending"),
                ("CI/CD with GitHub Actions", "pending"),
                ("Kubernetes Basics", "pending"),
            ]
            
            for i, (title, status) in enumerate(steps):
                db.add(LearningStep(
                    roadmap_id=roadmap.id,
                    title=title,
                    position=i+1,
                    status=status
                ))
            db.commit()

        # Calculate initial readiness score
        print("Calculating Readiness Score...")
        score = calculate_readiness_score(db, str(user.id))
        print(f"Final Readiness Score: {score.score}")
        print("Seeding complete! Start your app and login with demo@careerpilot.ai / demo123")
        
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
