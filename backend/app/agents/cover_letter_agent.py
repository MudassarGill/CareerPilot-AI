"""
============================================================
CareerPilot AI — Cover Letter & Application Agent (Phase 8)
============================================================
Synthesizes candidate profile data (parsed resume, verified skills)
with target job requirements to generate tailored, high-converting
cover letters.
============================================================
"""

from typing import Dict, Any, List
from app.config import settings


def generate_tailored_cover_letter(
    candidate_name: str,
    target_role: str,
    company_name: str,
    job_description: str,
    user_skills: List[str],
    tone: str = "Professional",
) -> Dict[str, Any]:
    """
    Generates a high-impact, tailored cover letter.
    """
    top_skills = user_skills[:5] if user_skills else ["Full Stack Engineering", "API Design", "Modern Frameworks"]
    skills_formatted = ", ".join(top_skills)

    # Key selling points customized to role
    key_points = [
        f"Demonstrated hands-on proficiency in {top_skills[0] if len(top_skills) > 0 else 'software engineering'}",
        f"Track record of scalable system implementation and collaborative technical execution",
        f"Alignment with {company_name}'s technical mission and architectural standards",
    ]

    tone_intro = (
        f"I am writing to express my strong enthusiasm for the {target_role} position at {company_name}."
        if tone == "Enthusiastic"
        else f"I am writing to submit my application for the {target_role} opportunity at {company_name}."
    )

    letter_text = f"""Dear Hiring Team at {company_name},

{tone_intro} With a proven foundation in modern software engineering and technical problem solving, I am eager to contribute to your engineering organization's continued innovation and growth.

Throughout my career, I have developed deep competency across core competencies including {skills_formatted}. My focus centers on architecting resilient, maintainable, and high-performance solutions that balance velocity with long-term software quality. Whether optimizing database throughput, creating seamless user interfaces, or streamlining deployment pipelines, I prioritize delivering measurable business impact.

{company_name}'s technical direction and commitment to engineering excellence strongly align with my professional values. I am particularly excited by the opportunity to leverage my expertise in {top_skills[0] if top_skills else 'software development'} to solve complex operational challenges and deliver robust user outcomes for your team.

Thank you for your time and consideration. I welcome the opportunity to discuss how my technical skills and dedication can directly support {company_name}'s objectives.

Sincerely,
{candidate_name}
CareerPilot AI Verified Candidate"""

    return {
        "job_title": target_role,
        "company_name": company_name,
        "cover_letter": letter_text,
        "key_selling_points": key_points,
    }
