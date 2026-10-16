"""
============================================================
CareerPilot AI — Job Intelligence Matcher API (Phase 5+)
============================================================
Handles automated ATS job matching, skill gap discovery vs
live market openings, application preparation checklists,
and saved job trackers.

Endpoints:
    GET  /api/jobs           → List jobs with personalized match %
    GET  /api/jobs/summary   → Market readiness & skill demand summary
    POST /api/jobs/save      → Bookmark/unbookmark a job
    POST /api/jobs/apply     → Track job application
============================================================
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.auth import get_current_user
from app.models.user import User
from app.models.skill import UserSkill, Skill
from app.models.resume import Resume
from app.schemas.jobs import (
    JobItem,
    JobSaveRequest,
    JobApplyRequest,
    JobMarketSummary,
)

router = APIRouter()

# Comprehensive curated high-growth tech positions database
TECH_JOBS_CATALOG = [
    {
        "id": "job_fe_1",
        "title": "Senior Frontend Engineer (React / Next.js)",
        "company": "Vercel Partner Labs",
        "location": "San Francisco, CA",
        "location_type": "Remote",
        "salary_range": "$140,000 - $175,000",
        "experience_level": "Senior",
        "category": "Frontend",
        "required_skills": ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL", "Jest", "Web Performance"],
        "description": "Architect high-speed, accessible user interfaces using React 19 and Next.js App Router. Optimize Core Web Vitals, SSR caching, and client state pipelines.",
        "posted_date": "2 days ago",
        "company_url": "https://vercel.com/careers",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Senior+Frontend+Engineer+React+Next.js+Vercel",
    },
    {
        "id": "job_be_1",
        "title": "Backend Systems Engineer (Python / FastAPI)",
        "company": "ScaleAI Infrastructure",
        "location": "New York, NY",
        "location_type": "Hybrid",
        "salary_range": "$135,000 - $165,000",
        "experience_level": "Mid-Level",
        "category": "Backend",
        "required_skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis", "Asyncio", "SQLAlchemy"],
        "description": "Build high-throughput asynchronous REST APIs and microservices. Handle database connection pools, indexing, caching layers, and CI/CD pipelines.",
        "posted_date": "1 day ago",
        "company_url": "https://scale.com/careers",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Backend+Systems+Engineer+Python+FastAPI+Scale+AI",
    },
    {
        "id": "job_ai_1",
        "title": "AI / RAG Solutions Engineer",
        "company": "Anthropic Partner Network",
        "location": "Austin, TX",
        "location_type": "Remote",
        "salary_range": "$160,000 - $195,000",
        "experience_level": "Senior",
        "category": "AI/ML",
        "required_skills": ["Python", "LangChain", "Vector Databases", "Embeddings", "PyTorch", "FastAPI", "ChromaDB"],
        "description": "Design enterprise Retrieval-Augmented Generation (RAG) agents, semantic chunking pipelines, and LLM evaluation benchmarks with LangGraph.",
        "posted_date": "Just now",
        "company_url": "https://www.anthropic.com/careers",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=AI+RAG+Solutions+Engineer+Anthropic",
    },
    {
        "id": "job_fs_1",
        "title": "Full Stack Software Developer",
        "company": "Fintech Streamline",
        "location": "Chicago, IL",
        "location_type": "Remote",
        "salary_range": "$125,000 - $155,000",
        "experience_level": "Mid-Level",
        "category": "Full Stack",
        "required_skills": ["React", "Node.js", "Python", "TypeScript", "PostgreSQL", "Docker", "REST APIs"],
        "description": "End-to-end feature ownership from reactive browser UI to database transactions. Implement authentication, Stripe payments, and automated test suites.",
        "posted_date": "3 days ago",
        "company_url": "https://stripe.com/jobs",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Full+Stack+Software+Developer+Stripe",
    },
    {
        "id": "job_do_1",
        "title": "Cloud DevOps & Platform Engineer",
        "company": "CloudNative Solutions",
        "location": "Seattle, WA",
        "location_type": "Remote",
        "salary_range": "$145,000 - $180,000",
        "experience_level": "Senior",
        "category": "DevOps",
        "required_skills": ["Kubernetes", "Docker", "AWS", "Terraform", "GitHub Actions", "Linux", "CI/CD"],
        "description": "Manage multi-cluster Kubernetes infrastructure, Terraform Infrastructure-as-Code (IaC), zero-trust security policies, and Prometheus monitoring.",
        "posted_date": "4 days ago",
        "company_url": "https://www.cncf.io/",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Cloud+DevOps+Platform+Engineer+Kubernetes",
    },
    {
        "id": "job_da_1",
        "title": "Data Analyst & Business Intelligence",
        "company": "Metropolitan Analytics",
        "location": "Boston, MA",
        "location_type": "Hybrid",
        "salary_range": "$95,000 - $125,000",
        "experience_level": "Mid-Level",
        "category": "Data",
        "required_skills": ["SQL", "Python", "Pandas", "Tableau", "Power BI", "Data Modeling", "Excel"],
        "description": "Deliver executive KPI dashboards, customer retention cohort analyses, and automated SQL ETL pipelines from data lakes.",
        "posted_date": "2 days ago",
        "company_url": "https://www.snowflake.com/en/company/careers/",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Data+Analyst+Business+Intelligence+Snowflake",
    },
    {
        "id": "job_fe_2",
        "title": "Frontend UI/UX Developer",
        "company": "DesignCraft Studios",
        "location": "Denver, CO",
        "location_type": "Onsite",
        "salary_range": "$105,000 - $130,000",
        "experience_level": "Junior",
        "category": "Frontend",
        "required_skills": ["HTML5", "CSS3", "JavaScript", "React", "Figma", "Responsive Design", "Git"],
        "description": "Transform high-fidelity Figma components into pixel-perfect, accessible React components with smooth CSS micro-animations.",
        "posted_date": "5 days ago",
        "company_url": "https://www.figma.com/careers/",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Frontend+UI+UX+Developer+React+Figma",
    },
    {
        "id": "job_be_2",
        "title": "Distributed Systems Architect",
        "company": "HyperScale Cloud",
        "location": "San Jose, CA",
        "location_type": "Remote",
        "salary_range": "$180,000 - $220,000",
        "experience_level": "Lead",
        "category": "Backend",
        "required_skills": ["Go", "Python", "Kafka", "PostgreSQL", "Microservices", "Redis", "gRPC"],
        "description": "Lead architectural strategy for event-driven distributed streaming pipelines handling millions of events per second with high availability.",
        "posted_date": "1 day ago",
        "company_url": "https://www.datadoghq.com/careers/",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Distributed+Systems+Architect+Datadog",
    },
    {
        "id": "job_se_1",
        "title": "Software Engineer (Backend / Systems)",
        "company": "Google Engineering",
        "location": "Mountain View, CA",
        "location_type": "Hybrid",
        "salary_range": "$150,000 - $200,000",
        "experience_level": "Mid-Level",
        "category": "Software Engineer",
        "required_skills": ["Python", "Java", "Data Structures", "Algorithms", "System Design", "SQL", "Git", "Testing"],
        "description": "Design and implement scalable backend services, optimize algorithms for large-scale data processing, and lead code quality initiatives.",
        "posted_date": "1 day ago",
        "company_url": "https://careers.google.com/",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Software+Engineer+Backend+Google",
    },
    {
        "id": "job_se_2",
        "title": "Senior Software Engineer (Platform)",
        "company": "Stripe Engineering",
        "location": "San Francisco, CA",
        "location_type": "Remote",
        "salary_range": "$175,000 - $220,000",
        "experience_level": "Senior",
        "category": "Software Engineer",
        "required_skills": ["Python", "JavaScript", "REST API", "Docker", "CI/CD", "System Design", "PostgreSQL", "Testing"],
        "description": "Build and scale mission-critical payment infrastructure serving millions of businesses. Focus on reliability, latency optimization, and API design.",
        "posted_date": "2 days ago",
        "company_url": "https://stripe.com/jobs",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Senior+Software+Engineer+Platform+Stripe",
    },
    {
        "id": "job_ca_1",
        "title": "Cloud Solutions Architect (AWS / GCP)",
        "company": "Accenture Cloud First",
        "location": "Dallas, TX",
        "location_type": "Remote",
        "salary_range": "$155,000 - $195,000",
        "experience_level": "Senior",
        "category": "Cloud",
        "required_skills": ["AWS", "Terraform", "Kubernetes", "Docker", "Networking", "CI/CD", "Linux", "Serverless"],
        "description": "Design multi-region cloud architectures, implement Infrastructure-as-Code automation, and lead enterprise cloud migration strategies.",
        "posted_date": "3 days ago",
        "company_url": "https://www.accenture.com/us-en/careers",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Cloud+Solutions+Architect+AWS+Accenture",
    },
    {
        "id": "job_cs_1",
        "title": "Cybersecurity Engineer (Offensive Security)",
        "company": "CrowdStrike",
        "location": "Austin, TX",
        "location_type": "Remote",
        "salary_range": "$135,000 - $175,000",
        "experience_level": "Mid-Level",
        "category": "Security",
        "required_skills": ["Penetration Testing", "Python", "Linux", "Networking", "SIEM Tools", "Cloud Security", "Incident Response"],
        "description": "Conduct penetration testing, develop threat detection rules, and build automated security monitoring pipelines for enterprise clients.",
        "posted_date": "2 days ago",
        "company_url": "https://www.crowdstrike.com/about/careers/",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Cybersecurity+Engineer+CrowdStrike",
    },
    {
        "id": "job_qa_1",
        "title": "Senior QA Automation Engineer",
        "company": "Atlassian Quality",
        "location": "Sydney, Australia",
        "location_type": "Remote",
        "salary_range": "$120,000 - $155,000",
        "experience_level": "Senior",
        "category": "QA",
        "required_skills": ["Selenium/Cypress", "Python", "JavaScript", "API Testing", "CI/CD", "Git", "Performance Testing"],
        "description": "Build and maintain comprehensive E2E test automation suites, integrate quality gates into CI/CD pipelines, and champion shift-left testing culture.",
        "posted_date": "4 days ago",
        "company_url": "https://www.atlassian.com/company/careers",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=QA+Automation+Engineer+Atlassian",
    },
    {
        "id": "job_ios_1",
        "title": "Senior iOS Developer (SwiftUI)",
        "company": "Apple Services",
        "location": "Cupertino, CA",
        "location_type": "Hybrid",
        "salary_range": "$165,000 - $210,000",
        "experience_level": "Senior",
        "category": "Mobile",
        "required_skills": ["Swift", "SwiftUI", "UIKit", "Core Data", "REST API", "Xcode", "Testing", "MVVM Architecture"],
        "description": "Build and ship consumer-facing iOS applications using SwiftUI with focus on performance, accessibility, and Apple Human Interface Guidelines.",
        "posted_date": "1 day ago",
        "company_url": "https://www.apple.com/careers/",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Senior+iOS+Developer+SwiftUI+Apple",
    },
    {
        "id": "job_and_1",
        "title": "Android Developer (Kotlin / Jetpack Compose)",
        "company": "Spotify Mobile",
        "location": "Stockholm, Sweden",
        "location_type": "Remote",
        "salary_range": "$130,000 - $170,000",
        "experience_level": "Mid-Level",
        "category": "Mobile",
        "required_skills": ["Kotlin", "Jetpack Compose", "Android SDK", "REST API", "Room Database", "Firebase", "Testing", "MVVM Architecture"],
        "description": "Develop and maintain the Spotify Android app using modern Jetpack Compose UI, Kotlin Coroutines, and clean architecture patterns.",
        "posted_date": "3 days ago",
        "company_url": "https://www.lifeatspotify.com/",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Android+Developer+Kotlin+Jetpack+Compose+Spotify",
    },
    {
        "id": "job_bc_1",
        "title": "Blockchain Smart Contract Developer",
        "company": "ConsenSys",
        "location": "New York, NY",
        "location_type": "Remote",
        "salary_range": "$145,000 - $190,000",
        "experience_level": "Senior",
        "category": "Blockchain",
        "required_skills": ["Solidity", "JavaScript", "Web3.js/Ethers.js", "Smart Contracts", "Security Auditing", "Git", "Testing"],
        "description": "Design, develop, and audit Solidity smart contracts for DeFi protocols. Implement security best practices and gas optimization techniques.",
        "posted_date": "2 days ago",
        "company_url": "https://consensys.io/careers",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Blockchain+Smart+Contract+Developer+ConsenSys",
    },
    {
        "id": "job_sre_1",
        "title": "Site Reliability Engineer (SRE)",
        "company": "Netflix Reliability",
        "location": "Los Gatos, CA",
        "location_type": "Remote",
        "salary_range": "$170,000 - $220,000",
        "experience_level": "Senior",
        "category": "SRE",
        "required_skills": ["Linux", "Python", "Kubernetes", "Docker", "Monitoring", "Terraform", "CI/CD", "Incident Response"],
        "description": "Ensure 99.99% availability for Netflix streaming infrastructure. Build chaos engineering tooling, SLO dashboards, and automated incident response.",
        "posted_date": "Just now",
        "company_url": "https://jobs.netflix.com/",
        "job_url": "https://www.linkedin.com/jobs/search/?keywords=Site+Reliability+Engineer+SRE+Netflix",
    },
]

# User saved / applied job tracking storage (in-memory per session)
USER_JOB_STATES = {}  # { f"{user_id}:{job_id}": { "saved": bool, "applied": bool } }


def _get_user_skill_names(db: Session, user_id) -> List[str]:
    """Retrieve all skills associated with current user."""
    names = []
    try:
        skills = (
            db.query(Skill.name)
            .join(UserSkill, UserSkill.skill_id == Skill.id)
            .filter(UserSkill.user_id == user_id)
            .all()
        )
        names = [s[0].lower() for s in skills]

        # Also check latest parsed resume for extracted technical skills
        latest_resume = (
            db.query(Resume)
            .filter(Resume.user_id == user_id)
            .order_by(Resume.uploaded_at.desc())
            .first()
        )
        if latest_resume and latest_resume.parsed_data:
            res_skills = latest_resume.parsed_data.get("skills", [])
            if isinstance(res_skills, list):
                for item in res_skills:
                    if isinstance(item, str) and item.lower() not in names:
                        names.append(item.lower())
    except Exception as exc:
        print(f"[WARN] Error fetching user skills for jobs: {exc}")

    return names


@router.get("", response_model=List[JobItem])
def get_matched_jobs(
    search: Optional[str] = None,
    category: Optional[str] = None,
    location_type: Optional[str] = None,
    min_match: Optional[float] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get all live jobs with personalized ATS and skill match percentages
    computed against the current authenticated user's profile.
    """
    matched_results = []
    try:
        user_skills = _get_user_skill_names(db, current_user.id)
    except Exception as e:
        print(f"[WARN] Error in _get_user_skill_names: {e}")
        user_skills = []

    for job in TECH_JOBS_CATALOG:
        try:
            # Category filter
            if category and category.lower() != "all" and job["category"].lower() != category.lower():
                continue

            # Location filter
            if location_type and location_type.lower() != "all" and job["location_type"].lower() != location_type.lower():
                continue

            # Search query filter
            if search:
                query = search.lower()
                in_title = query in job["title"].lower()
                in_company = query in job["company"].lower()
                in_desc = query in job["description"].lower()
                in_skills = any(query in sk.lower() for sk in job["required_skills"])
                if not (in_title or in_company or in_desc or in_skills):
                    continue

            # Calculate matching and missing skills
            matching_skills = []
            missing_skills = []

            for req in job["required_skills"]:
                req_clean = req.lower()
                is_matched = any(
                    req_clean in u_sk or u_sk in req_clean for u_sk in user_skills
                )
                if is_matched:
                    matching_skills.append(req)
                else:
                    missing_skills.append(req)

            total_req = len(job["required_skills"])
            if total_req > 0:
                match_pct = round((len(matching_skills) / total_req) * 100.0, 1)
            else:
                match_pct = 70.0

            # Optional threshold filter
            if min_match and match_pct < min_match:
                continue

            state_key = f"{str(current_user.id)}:{job['id']}"
            user_state = USER_JOB_STATES.get(state_key, {"saved": False, "applied": False})

            status_str = "applied" if user_state.get("applied") else ("saved" if user_state.get("saved") else "open")

            matched_results.append(
                JobItem(
                    id=job["id"],
                    title=job["title"],
                    company=job["company"],
                    location=job["location"],
                    location_type=job["location_type"],
                    salary_range=job["salary_range"],
                    experience_level=job["experience_level"],
                    category=job["category"],
                    required_skills=job["required_skills"],
                    description=job["description"],
                    posted_date=job["posted_date"],
                    match_pct=match_pct,
                    matching_skills=matching_skills,
                    missing_skills=missing_skills,
                    company_url=job.get("company_url"),
                    job_url=job.get("job_url"),
                    is_saved=user_state.get("saved", False),
                    status=status_str,
                )
            )
        except Exception as job_err:
            print(f"[WARN] Error matching single job {job.get('id')}: {job_err}")
            continue

    # Sort primarily by match percentage descending
    matched_results.sort(key=lambda j: j.match_pct, reverse=True)
    return matched_results


@router.get("/summary", response_model=JobMarketSummary)
def get_market_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get aggregated market readiness summary and top demanded skills.
    """
    try:
        user_skills = _get_user_skill_names(db, current_user.id)
    except Exception as e:
        print(f"[WARN] Error fetching user skills for summary: {e}")
        user_skills = []

    all_scores = []
    missing_frequency = {}
    demanded_frequency = {}

    for job in TECH_JOBS_CATALOG:
        try:
            matching_count = 0
            for req in job["required_skills"]:
                demanded_frequency[req] = demanded_frequency.get(req, 0) + 1
                req_clean = req.lower()
                if any(req_clean in u or u in req_clean for u in user_skills):
                    matching_count += 1
                else:
                    missing_frequency[req] = missing_frequency.get(req, 0) + 1

            total = len(job["required_skills"])
            score = (matching_count / total * 100.0) if total > 0 else 70.0
            all_scores.append(score)
        except Exception:
            continue

    avg_score = round(sum(all_scores) / len(all_scores), 1) if all_scores else 0.0
    high_match = sum(1 for s in all_scores if s >= 75.0)

    # Sort demanded and missing skills by frequency
    sorted_demanded = sorted(demanded_frequency.keys(), key=lambda k: demanded_frequency[k], reverse=True)[:5]
    sorted_missing = sorted(missing_frequency.keys(), key=lambda k: missing_frequency[k], reverse=True)[:5]

    return JobMarketSummary(
        total_jobs=len(TECH_JOBS_CATALOG),
        high_match_count=high_match,
        average_match_pct=avg_score,
        top_demanded_skills=sorted_demanded,
        top_missing_skills=sorted_missing,
    )


@router.post("/save")
def toggle_save_job(
    payload: JobSaveRequest,
    current_user: User = Depends(get_current_user),
):
    """Bookmark or unbookmark a job posting."""
    state_key = f"{str(current_user.id)}:{payload.job_id}"
    current_state = USER_JOB_STATES.get(state_key, {"saved": False, "applied": False})
    new_saved = not current_state["saved"]
    current_state["saved"] = new_saved
    USER_JOB_STATES[state_key] = current_state

    return {
        "job_id": payload.job_id,
        "is_saved": new_saved,
        "message": "Job bookmarked" if new_saved else "Job removed from bookmarks",
    }


@router.post("/apply")
def apply_to_job(
    payload: JobApplyRequest,
    current_user: User = Depends(get_current_user),
):
    """Mark a job as applied and track in candidate log."""
    state_key = f"{str(current_user.id)}:{payload.job_id}"
    current_state = USER_JOB_STATES.get(state_key, {"saved": False, "applied": False})
    current_state["applied"] = True
    USER_JOB_STATES[state_key] = current_state

    return {
        "job_id": payload.job_id,
        "status": "applied",
        "message": "Application logged successfully! Check Mock Interview to prepare for candidate screening.",
    }
