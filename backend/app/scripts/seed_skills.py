"""
============================================================
CareerPilot AI — Seed Skills Catalog Script
============================================================
Populates the 'skills' table with standard industry skills
across multiple technology and professional categories.
============================================================
"""

from app.db.database import SessionLocal
from app.models.skill import Skill

SKILLS_SEED_DATA = [
    # Frontend
    {"name": "JavaScript", "category": "Frontend"},
    {"name": "TypeScript", "category": "Frontend"},
    {"name": "React", "category": "Frontend"},
    {"name": "Next.js", "category": "Frontend"},
    {"name": "Vue.js", "category": "Frontend"},
    {"name": "HTML5", "category": "Frontend"},
    {"name": "CSS3", "category": "Frontend"},
    {"name": "Tailwind CSS", "category": "Frontend"},
    {"name": "Responsive Design", "category": "Frontend"},
    {"name": "Webpack/Vite", "category": "Frontend"},
    {"name": "UI/UX Principles", "category": "Frontend"},

    # Backend
    {"name": "Python", "category": "Backend"},
    {"name": "FastAPI", "category": "Backend"},
    {"name": "Node.js", "category": "Backend"},
    {"name": "Express.js", "category": "Backend"},
    {"name": "Django", "category": "Backend"},
    {"name": "REST API", "category": "Backend"},
    {"name": "GraphQL", "category": "Backend"},
    {"name": "Microservices", "category": "Backend"},
    {"name": "System Design", "category": "Backend"},
    {"name": "Authentication & JWT", "category": "Backend"},

    # Database & Caching
    {"name": "SQL", "category": "Database"},
    {"name": "PostgreSQL", "category": "Database"},
    {"name": "MongoDB", "category": "Database"},
    {"name": "Redis", "category": "Database"},
    {"name": "Database Design", "category": "Database"},

    # DevOps & Cloud
    {"name": "Git & GitHub", "category": "DevOps"},
    {"name": "Docker", "category": "DevOps"},
    {"name": "Kubernetes", "category": "DevOps"},
    {"name": "CI/CD Pipelines", "category": "DevOps"},
    {"name": "Linux", "category": "DevOps"},
    {"name": "AWS (Amazon Web Services)", "category": "Cloud"},
    {"name": "Google Cloud (GCP)", "category": "Cloud"},
    {"name": "Terraform", "category": "DevOps"},

    # AI & Machine Learning
    {"name": "Machine Learning", "category": "AI/ML"},
    {"name": "Deep Learning", "category": "AI/ML"},
    {"name": "TensorFlow/PyTorch", "category": "AI/ML"},
    {"name": "Natural Language Processing (NLP)", "category": "AI/ML"},
    {"name": "Computer Vision", "category": "AI/ML"},
    {"name": "LangChain / LLMs", "category": "AI/ML"},
    {"name": "Data Preprocessing", "category": "AI/ML"},

    # Data Science & Analytics
    {"name": "Data Analysis", "category": "Data"},
    {"name": "Data Visualization", "category": "Data"},
    {"name": "Pandas & NumPy", "category": "Data"},
    {"name": "ETL Pipelines", "category": "Data"},
    {"name": "Tableau / Power BI", "category": "Data"},
    {"name": "Statistics", "category": "Data"},

    # Testing & Quality
    {"name": "Unit Testing", "category": "Testing"},
    {"name": "Integration Testing", "category": "Testing"},
    {"name": "Performance Optimization", "category": "Engineering"},

    # Soft & Professional Skills
    {"name": "Agile / Scrum", "category": "Methodology"},
    {"name": "Technical Communication", "category": "Soft Skills"},
    {"name": "Problem Solving", "category": "Soft Skills"},
    {"name": "Team Leadership", "category": "Soft Skills"},
]


def seed_skills():
    db = SessionLocal()
    try:
        added = 0
        for item in SKILLS_SEED_DATA:
            existing = db.query(Skill).filter(Skill.name.ilike(item["name"])).first()
            if not existing:
                skill = Skill(name=item["name"], category=item["category"])
                db.add(skill)
                added += 1
        db.commit()
        print(f"[SUCCESS] Seeded {added} skills into the catalog.")
    except Exception as exc:
        db.rollback()
        print(f"[ERROR] Failed to seed skills: {exc}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_skills()
