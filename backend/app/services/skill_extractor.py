"""
============================================================
CareerPilot AI — Resume Technical Skill Extractor
============================================================
Extracts structured technical skills, competencies, and tools
from raw resume text and parsed sections to power ATS matching,
learning roadmaps, and job recommendations.
============================================================
"""

import re
from typing import List, Dict

# Comprehensive canonical tech lexicon
TECH_SKILL_PATTERNS = {
    # AI / Machine Learning / Data Science
    "Python": [r"\bpython\b"],
    "Machine Learning": [r"\bmachine\s+learning\b", r"\bml\b"],
    "Deep Learning": [r"\bdeep\s+learning\b"],
    "AI/ML": [r"\bai/ml\b", r"\bartificial\s+intelligence\b"],
    "Natural Language Processing": [r"\bnatural\s+language\s+processing\b", r"\bnlp\b"],
    "Computer Vision": [r"\bcomputer\s+vision\b", r"\bcv\b"],
    "Large Language Models": [r"\blarge\s+language\s+models\b", r"\bllms?\b", r"\bgenai\b", r"\bgenerative\s+ai\b"],
    "PyTorch": [r"\bpytorch\b"],
    "TensorFlow": [r"\btensorflow\b"],
    "Keras": [r"\bkeras\b"],
    "Scikit-Learn": [r"\bscikit-learn\b", r"\bsklearn\b"],
    "Pandas": [r"\bpandas\b"],
    "NumPy": [r"\bnumpy\b"],
    "Hugging Face": [r"\bhugging\s*face\b", r"\btransformers\b"],
    "LangChain": [r"\blangchain\b"],
    "LlamaIndex": [r"\bllamaindex\b"],
    "OpenCV": [r"\bopencv\b"],
    "Data Science": [r"\bdata\s+science\b", r"\bdata\s+scientist\b"],
    "Data Engineering": [r"\bdata\s+engineering\b"],
    "Apache Spark": [r"\bspark\b", r"\bpyspark\b"],
    "Kafka": [r"\bkafka\b"],

    # Programming Languages
    "JavaScript": [r"\bjavascript\b", r"\bjs\b"],
    "TypeScript": [r"\btypescript\b", r"\bts\b"],
    "Java": [r"\bjava\b(?!\s*script)"],
    "C++": [r"\bc\+\+\b"],
    "C#": [r"\bc#\b", r"\bcsharp\b"],
    "Go": [r"\bgolang\b", r"\bgo\s+language\b", r"\bgo\b"],
    "Rust": [r"\brust\b"],
    "PHP": [r"\bphp\b"],
    "Ruby": [r"\bruby\b"],
    "Swift": [r"\bswift\b"],
    "Kotlin": [r"\bkotlin\b"],
    "SQL": [r"\bsql\b"],

    # Frontend
    "React": [r"\breact\b", r"\breact\.?js\b"],
    "Next.js": [r"\bnext\.?js\b"],
    "Vue.js": [r"\bvue\b", r"\bvue\.?js\b"],
    "Angular": [r"\bangular\b"],
    "HTML/CSS": [r"\bhtml5?\b", r"\bcss3?\b"],
    "Tailwind CSS": [r"\btailwind\b"],
    "Redux": [r"\bredux\b"],

    # Backend & APIs
    "Node.js": [r"\bnode\b", r"\bnode\.?js\b"],
    "Express.js": [r"\bexpress\b", r"\bexpress\.?js\b"],
    "FastAPI": [r"\bfastapi\b"],
    "Django": [r"\bdjango\b"],
    "Flask": [r"\bflask\b"],
    "Spring Boot": [r"\bspring\s+boot\b", r"\bspring\b"],
    "REST APIs": [r"\brest\s*apis?\b", r"\brestful\b", r"\bapis?\b"],
    "GraphQL": [r"\bgraphql\b"],
    "Microservices": [r"\bmicroservices\b"],

    # Databases
    "PostgreSQL": [r"\bpostgresql\b", r"\bpostgres\b"],
    "MySQL": [r"\bmysql\b"],
    "MongoDB": [r"\bmongodb\b", r"\bmongo\b"],
    "Redis": [r"\bredis\b"],
    "SQLite": [r"\bsqlite\b"],

    # Cloud & DevOps
    "Docker": [r"\bdocker\b"],
    "Kubernetes": [r"\bkubernetes\b", r"\bk8s\b"],
    "AWS": [r"\baws\b", r"\bamazon\s+web\s+services\b"],
    "Google Cloud": [r"\bgcp\b", r"\bgoogle\s+cloud\b"],
    "Azure": [r"\bazure\b"],
    "CI/CD": [r"\bci/cd\b", r"\bcontinuous\s+integration\b"],
    "Git": [r"\bgit\b", r"\bgithub\b", r"\bgitlab\b"],
    "Linux": [r"\blinux\b", r"\bubuntu\b"],
    "Terraform": [r"\bterraform\b"],
    "Security": [r"\bsecurity\b", r"\bcybersecurity\b"],

    # Software Engineering Practices
    "Agile": [r"\bagile\b", r"\bscrum\b"],
    "Testing": [r"\btesting\b", r"\bunit\s+tests?\b", r"\bjest\b", r"\bpytest\b", r"\btdd\b"],
    "System Design": [r"\bsystem\s+design\b", r"\barchitecture\b"],
}


def extract_skills_from_text(raw_text: str = "", sections: Dict[str, str] = None) -> List[str]:
    """
    Extract standardized technical skills from raw resume text and parsed sections.
    """
    combined_text = raw_text or ""
    if sections and isinstance(sections, dict):
        skills_sec = sections.get("skills", "")
        if skills_sec:
            combined_text = skills_sec + "\n" + combined_text

    lower_text = combined_text.lower()
    detected_skills: List[str] = []

    for skill_name, patterns in TECH_SKILL_PATTERNS.items():
        for pat in patterns:
            if re.search(pat, lower_text, re.IGNORECASE):
                if skill_name not in detected_skills:
                    detected_skills.append(skill_name)
                break

    # Parse explicit items from skills section
    if sections and isinstance(sections, dict):
        skills_sec = sections.get("skills", "")
        if skills_sec:
            tokens = re.split(r"[,;•\n\t/|]+", skills_sec)
            for t in tokens:
                cleaned = t.strip()
                if 2 <= len(cleaned) <= 30 and re.match(r"^[A-Za-z0-9+#. -]+$", cleaned):
                    if not any(cleaned.lower() == d.lower() for d in detected_skills):
                        lower_clean = cleaned.lower()
                        if lower_clean not in [
                            "skills", "technical skills", "languages", "tools",
                            "frameworks", "technologies", "proficient", "familiar",
                            "expert", "experience", "knowledge", "libraries"
                        ]:
                            detected_skills.append(
                                cleaned.title() if len(cleaned) > 4 else cleaned.upper()
                            )

    return detected_skills

