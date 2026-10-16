"""
============================================================
CareerPilot AI — Skill Gap Analysis Agent
============================================================
Compares user skills against target role requirements and
identifies gaps, providing actionable insights.

Capabilities:
    - Load role skill templates
    - Compare user proficiency vs required levels
    - Calculate overall match percentage
    - Categorize gaps: missing / below_target / on_track / exceeded
============================================================
"""

import json
import os
from typing import Dict, List, Optional
from pathlib import Path


# ---- Built-in Role Templates ----
# These define the required skills and minimum proficiency for each target role.
# Each skill maps to a required level (0-100).
ROLE_TEMPLATES = {
    "Frontend Developer": {
        "JavaScript": 80, "TypeScript": 70, "React": 80, "HTML": 85, "CSS": 80,
        "Git": 70, "REST API": 65, "Responsive Design": 75, "Testing": 60,
        "Performance Optimization": 55, "Webpack/Vite": 50, "UI/UX Principles": 60,
    },
    "Backend Developer": {
        "Python": 80, "SQL": 75, "REST API": 80, "Database Design": 70,
        "Git": 70, "Docker": 60, "Authentication": 65, "Testing": 65,
        "Linux": 55, "Caching (Redis)": 50, "Message Queues": 45,
        "CI/CD": 50, "System Design": 55,
    },
    "Full Stack Developer": {
        "JavaScript": 75, "TypeScript": 60, "React": 70, "Python": 70,
        "SQL": 70, "REST API": 75, "HTML": 80, "CSS": 70, "Git": 70,
        "Docker": 55, "Database Design": 60, "Testing": 60,
        "Authentication": 60, "CI/CD": 45, "Cloud (AWS/GCP)": 40,
    },
    "AI/ML Engineer": {
        "Python": 85, "Machine Learning": 80, "Deep Learning": 70,
        "TensorFlow/PyTorch": 70, "Data Analysis": 75, "SQL": 65,
        "Statistics": 70, "NLP": 60, "Computer Vision": 50,
        "Data Preprocessing": 75, "Git": 65, "Docker": 50,
        "Cloud (AWS/GCP)": 45, "MLOps": 40,
    },
    "DevOps Engineer": {
        "Linux": 80, "Docker": 80, "Kubernetes": 70, "CI/CD": 80,
        "Terraform": 65, "Cloud (AWS/GCP)": 75, "Scripting (Bash/Python)": 70,
        "Monitoring": 65, "Networking": 60, "Git": 75,
        "Security": 55, "Ansible": 50,
    },
    "Data Analyst": {
        "SQL": 85, "Python": 70, "Data Visualization": 80, "Excel": 75,
        "Statistics": 70, "Data Analysis": 80, "Tableau/Power BI": 65,
        "Data Cleaning": 75, "Communication": 70, "Git": 40,
        "R": 40, "Business Intelligence": 55,
    },
    "Data Engineer": {
        "Python": 80, "SQL": 85, "ETL": 80, "Apache Spark": 65,
        "Cloud (AWS/GCP)": 70, "Docker": 60, "Data Modeling": 70,
        "Streaming (Kafka)": 55, "Data Warehousing": 65, "Git": 65,
        "Airflow": 55, "Linux": 55,
    },
    "Mobile Developer": {
        "JavaScript": 70, "React Native": 75, "TypeScript": 60,
        "Mobile UI": 75, "REST API": 70, "Git": 65, "State Management": 65,
        "Testing": 55, "App Store Deployment": 50, "Performance Optimization": 55,
        "Push Notifications": 45, "Offline Storage": 45,
    },
    "Software Engineer": {
        "Python": 80, "JavaScript": 75, "Data Structures": 85, "Algorithms": 85,
        "System Design": 75, "SQL": 70, "Git": 75, "REST API": 75,
        "Testing": 70, "CI/CD": 60, "Docker": 55, "Cloud (AWS/GCP)": 50,
        "Object-Oriented Design": 80, "Linux": 55, "Agile/Scrum": 60,
    },
    "Cloud Architect": {
        "Cloud (AWS/GCP)": 90, "Terraform": 80, "Docker": 80, "Kubernetes": 75,
        "Networking": 70, "Linux": 70, "Security": 70, "CI/CD": 65,
        "Python": 60, "Serverless": 65, "Cost Optimization": 60,
        "Disaster Recovery": 60, "IAM & Identity": 65,
    },
    "Cybersecurity Engineer": {
        "Networking": 80, "Linux": 80, "Security": 90, "Python": 70,
        "Penetration Testing": 75, "Cryptography": 70, "Firewalls & IDS": 75,
        "SIEM Tools": 65, "Compliance (SOC2/ISO)": 60, "Incident Response": 70,
        "Cloud Security": 65, "Scripting (Bash/Python)": 65,
    },
    "QA / Test Engineer": {
        "Testing": 90, "Selenium/Cypress": 80, "Python": 70, "JavaScript": 65,
        "API Testing": 75, "CI/CD": 60, "Git": 65, "SQL": 55,
        "Performance Testing": 60, "Test Planning": 75, "Agile/Scrum": 65,
        "Docker": 40, "Accessibility Testing": 50,
    },
    "Game Developer": {
        "C++": 80, "C#": 75, "Unity": 75, "Unreal Engine": 65,
        "3D Mathematics": 70, "Physics Simulation": 60, "Shader Programming": 55,
        "Git": 60, "Game Design": 65, "Performance Optimization": 70,
        "Networking (Multiplayer)": 50, "Data Structures": 70,
    },
    "Blockchain Developer": {
        "Solidity": 85, "JavaScript": 75, "Web3.js/Ethers.js": 80,
        "Smart Contracts": 85, "Cryptography": 70, "Rust": 55,
        "DeFi Protocols": 60, "Security Auditing": 65, "Git": 65,
        "Node.js": 60, "Testing": 60, "System Design": 55,
    },
    "Embedded Systems Engineer": {
        "C": 85, "C++": 80, "RTOS": 75, "Microcontrollers": 80,
        "Assembly": 55, "Linux Kernel": 65, "Hardware Debugging": 70,
        "Communication Protocols (SPI/I2C/UART)": 75, "Git": 60,
        "Python": 50, "PCB Design": 45, "Signal Processing": 55,
    },
    "iOS Developer": {
        "Swift": 85, "SwiftUI": 75, "UIKit": 70, "Xcode": 80,
        "Core Data": 65, "REST API": 70, "Git": 65, "Testing": 60,
        "App Store Deployment": 70, "MVVM Architecture": 65,
        "Combine/Concurrency": 60, "Accessibility": 50,
    },
    "Android Developer": {
        "Kotlin": 85, "Jetpack Compose": 75, "Android SDK": 80,
        "REST API": 70, "Room Database": 65, "Git": 65, "Testing": 60,
        "Google Play Deployment": 65, "MVVM Architecture": 65,
        "Coroutines/Flow": 60, "Firebase": 55, "Material Design": 60,
    },
    "Site Reliability Engineer": {
        "Linux": 85, "Python": 75, "Docker": 80, "Kubernetes": 80,
        "Monitoring": 80, "CI/CD": 75, "Terraform": 65,
        "Cloud (AWS/GCP)": 75, "Networking": 70, "Scripting (Bash/Python)": 75,
        "Incident Response": 70, "SLO/SLI Management": 65, "Git": 70,
    },
}


class SkillGapAgent:
    """Identifies missing skills and gaps against target roles."""

    def get_available_roles(self) -> List[str]:
        """Return list of supported target roles."""
        return list(ROLE_TEMPLATES.keys())

    def get_role_requirements(self, target_role: str) -> Optional[Dict[str, int]]:
        """Get the skill requirements for a target role."""
        return ROLE_TEMPLATES.get(target_role)

    async def analyze_gap(
        self,
        user_skills: Dict[str, int],
        target_role: str,
    ) -> dict:
        """
        Analyze skill gap between user's current skills and target role.

        Args:
            user_skills: Dict mapping skill_name (lowercase) -> proficiency (0-100)
            target_role: Name of the target role

        Returns:
            dict with: target_role, overall_match_pct, total_required,
                       total_matched, gaps (list of gap items)
        """
        requirements = ROLE_TEMPLATES.get(target_role)
        if not requirements:
            return {
                "target_role": target_role,
                "overall_match_pct": 0,
                "total_required": 0,
                "total_matched": 0,
                "gaps": [],
                "error": f"Unknown target role: {target_role}",
            }

        gaps = []
        total_required = len(requirements)
        total_matched = 0
        total_score = 0

        # Normalize user skill names to lowercase for matching
        user_skills_lower = {k.lower(): v for k, v in user_skills.items()}

        for skill_name, required_level in requirements.items():
            skill_lower = skill_name.lower()
            current_level = user_skills_lower.get(skill_lower, 0)

            # Determine status
            if current_level == 0:
                status = "missing"
            elif current_level < required_level * 0.7:
                status = "below_target"
            elif current_level >= required_level:
                status = "exceeded"
                total_matched += 1
            else:
                status = "on_track"
                total_matched += 1

            gap = max(required_level - current_level, 0)

            # Calculate contribution to overall match
            ratio = min(current_level / required_level, 1.0) if required_level > 0 else 1.0
            total_score += ratio

            gaps.append({
                "skill_name": skill_name,
                "category": self._categorize_skill(skill_name),
                "required_level": required_level,
                "current_level": current_level,
                "gap": gap,
                "status": status,
            })

        overall_match_pct = round((total_score / total_required) * 100, 1) if total_required > 0 else 0

        # Sort gaps: missing first, then below_target, then on_track, then exceeded
        status_order = {"missing": 0, "below_target": 1, "on_track": 2, "exceeded": 3}
        gaps.sort(key=lambda g: (status_order.get(g["status"], 4), -g["gap"]))

        return {
            "target_role": target_role,
            "overall_match_pct": overall_match_pct,
            "total_required": total_required,
            "total_matched": total_matched,
            "gaps": gaps,
        }

    def _categorize_skill(self, skill_name: str) -> str:
        """Assign a category to a skill based on its name."""
        name_lower = skill_name.lower()

        language_keywords = ["python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", "kotlin", "swift", "r"]
        framework_keywords = ["react", "angular", "vue", "django", "flask", "fastapi", "spring", "express", "next", "node"]
        devops_keywords = ["docker", "kubernetes", "ci/cd", "terraform", "ansible", "jenkins", "monitoring", "linux"]
        data_keywords = ["sql", "data", "etl", "spark", "kafka", "warehouse", "tableau", "power bi", "excel", "statistics"]
        ai_keywords = ["machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "computer vision", "mlops"]
        soft_keywords = ["communication", "leadership", "teamwork", "problem solving", "agile", "scrum"]

        for kw in language_keywords:
            if kw in name_lower:
                return "Programming Languages"
        for kw in framework_keywords:
            if kw in name_lower:
                return "Frameworks & Libraries"
        for kw in devops_keywords:
            if kw in name_lower:
                return "DevOps & Infrastructure"
        for kw in data_keywords:
            if kw in name_lower:
                return "Data & Analytics"
        for kw in ai_keywords:
            if kw in name_lower:
                return "AI & Machine Learning"
        for kw in soft_keywords:
            if kw in name_lower:
                return "Soft Skills"

        return "Technical Skills"
