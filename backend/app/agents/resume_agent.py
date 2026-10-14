"""
============================================================
CareerPilot AI — Resume Analyzer Agent
============================================================
Parses uploaded resume files (PDF/DOCX) and extracts structured
information using text processing and pattern matching.

Capabilities:
    - Extract text from PDF (PyMuPDF/pdfplumber) and DOCX (python-docx)
    - Identify sections: Education, Experience, Skills, Projects,
      Certifications, Summary/Objective
    - Evaluate content quality (action verbs, quantification)
    - Return structured parsed data for storage and display
============================================================
"""

import re
import os
from typing import Dict, List, Optional, Tuple


# ---- Section Header Patterns ----
SECTION_PATTERNS = {
    "summary": r"(?i)\b(summary|objective|profile|about\s*me|professional\s*summary|career\s*objective)\b",
    "experience": r"(?i)\b(experience|work\s*experience|employment|professional\s*experience|work\s*history)\b",
    "education": r"(?i)\b(education|academic|qualifications|academic\s*background|degrees)\b",
    "skills": r"(?i)\b(skills|technical\s*skills|core\s*competencies|competencies|technologies|tools)\b",
    "projects": r"(?i)\b(projects|personal\s*projects|key\s*projects|academic\s*projects)\b",
    "certifications": r"(?i)\b(certifications|certificates|licenses|professional\s*development)\b",
    "awards": r"(?i)\b(awards|honors|achievements|accomplishments)\b",
    "languages": r"(?i)\b(languages|language\s*proficiency)\b",
    "references": r"(?i)\b(references|referees)\b",
}

# ---- Action Verbs for Quality Check ----
ACTION_VERBS = {
    "achieved", "administered", "analyzed", "built", "collaborated",
    "created", "delivered", "designed", "developed", "directed",
    "enhanced", "established", "executed", "generated", "implemented",
    "improved", "increased", "initiated", "launched", "led",
    "managed", "mentored", "negotiated", "optimized", "orchestrated",
    "organized", "pioneered", "planned", "presented", "produced",
    "reduced", "resolved", "spearheaded", "streamlined", "supervised",
    "transformed", "upgraded", "architected", "automated", "configured",
    "debugged", "deployed", "engineered", "integrated", "maintained",
    "migrated", "modernized", "monitored", "refactored", "scaled",
    "secured", "shipped", "tested", "trained", "wrote",
}


class ResumeAnalyzerAgent:
    """Parses and analyses resume documents using text processing."""

    async def parse_resume(self, file_path: str) -> dict:
        """
        Parse a resume file and return structured data.

        Args:
            file_path: Absolute path to the uploaded PDF or DOCX file.

        Returns:
            dict with keys: raw_text, sections, contact_info, word_count
        """
        ext = os.path.splitext(file_path)[1].lower()

        if ext == ".pdf":
            raw_text = self._extract_pdf(file_path)
        elif ext in (".docx", ".doc"):
            raw_text = self._extract_docx(file_path)
        else:
            return {"error": f"Unsupported file type: {ext}"}

        if not raw_text or not raw_text.strip():
            return {"error": "Could not extract any text from the file."}

        sections = self._identify_sections(raw_text)
        contact_info = self._extract_contact_info(raw_text)

        return {
            "raw_text": raw_text,
            "sections": sections,
            "contact_info": contact_info,
            "word_count": len(raw_text.split()),
        }

    async def evaluate_quality(self, parsed_data: dict) -> dict:
        """
        Evaluate resume content quality and completeness.

        Returns a dict with:
            - overall_score (0-100)
            - section_scores: per-section quality
            - suggestions: list of improvement tips
        """
        if "error" in parsed_data:
            return {"overall_score": 0, "section_scores": {}, "suggestions": ["Fix file parsing error first."]}

        raw_text = parsed_data.get("raw_text", "")
        sections = parsed_data.get("sections", {})
        suggestions = []
        section_scores = {}

        # ---- Section Completeness (40 points max) ----
        required_sections = ["summary", "experience", "education", "skills"]
        optional_sections = ["projects", "certifications"]
        section_completeness = 0

        for sec in required_sections:
            if sec in sections and len(sections[sec].strip()) > 20:
                section_completeness += 8
            else:
                suggestions.append(f"Add or expand your '{sec.title()}' section.")

        for sec in optional_sections:
            if sec in sections and len(sections[sec].strip()) > 10:
                section_completeness += 4

        # ---- Action Verbs (20 points max) ----
        words = set(raw_text.lower().split())
        verbs_found = words.intersection(ACTION_VERBS)
        verb_score = min(len(verbs_found) * 2, 20)
        if len(verbs_found) < 5:
            suggestions.append(f"Use more action verbs (e.g., {', '.join(list(ACTION_VERBS)[:5])}). Found only {len(verbs_found)}.")

        # ---- Quantified Metrics (20 points max) ----
        metrics_pattern = r"\d+[\+%]|\$[\d,]+|\d+\s*(?:users|clients|team|projects|years|months)"
        metrics_found = re.findall(metrics_pattern, raw_text, re.IGNORECASE)
        metrics_score = min(len(metrics_found) * 4, 20)
        if len(metrics_found) < 3:
            suggestions.append("Quantify your achievements with numbers (e.g., 'Increased revenue by 25%').")

        # ---- Length Check (10 points max) ----
        word_count = parsed_data.get("word_count", 0)
        if word_count < 150:
            length_score = 3
            suggestions.append("Resume is too short. Aim for at least 300-600 words.")
        elif word_count < 300:
            length_score = 6
            suggestions.append("Resume could be more detailed. Aim for 400-600 words.")
        elif word_count > 1500:
            length_score = 6
            suggestions.append("Resume may be too long. Consider condensing to 1-2 pages.")
        else:
            length_score = 10

        # ---- Contact Info (10 points max) ----
        contact = parsed_data.get("contact_info", {})
        contact_score = 0
        if contact.get("email"):
            contact_score += 4
        else:
            suggestions.append("Include your email address.")
        if contact.get("phone"):
            contact_score += 3
        if contact.get("linkedin") or contact.get("github") or contact.get("website"):
            contact_score += 3
        else:
            suggestions.append("Add a LinkedIn or portfolio link.")

        overall_score = min(section_completeness + verb_score + metrics_score + length_score + contact_score, 100)

        section_scores = {
            "section_completeness": section_completeness,
            "action_verbs": verb_score,
            "quantified_metrics": metrics_score,
            "length": length_score,
            "contact_info": contact_score,
        }

        return {
            "overall_score": round(overall_score, 1),
            "section_scores": section_scores,
            "suggestions": suggestions,
            "action_verbs_found": list(verbs_found),
            "metrics_found": metrics_found[:10],
        }

    # ---- Private Helpers ----

    def _extract_pdf(self, file_path: str) -> str:
        """Extract text from a PDF file using pdfplumber (fallback to PyMuPDF)."""
        text = ""
        try:
            import pdfplumber
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception:
            try:
                import fitz  # PyMuPDF
                doc = fitz.open(file_path)
                for page in doc:
                    text += page.get_text() + "\n"
                doc.close()
            except Exception:
                text = ""
        return text.strip()

    def _extract_docx(self, file_path: str) -> str:
        """Extract text from a DOCX file using python-docx."""
        text = ""
        try:
            from docx import Document
            doc = Document(file_path)
            for para in doc.paragraphs:
                if para.text.strip():
                    text += para.text + "\n"
        except Exception:
            text = ""
        return text.strip()

    def _identify_sections(self, text: str) -> Dict[str, str]:
        """
        Identify and extract resume sections using header patterns.
        Returns a dict mapping section_name -> section_content.
        """
        lines = text.split("\n")
        sections = {}
        current_section = "header"
        current_content = []

        for line in lines:
            matched = False
            for section_name, pattern in SECTION_PATTERNS.items():
                # A section header is typically a standalone line or starts with the keyword
                stripped = line.strip()
                if stripped and re.match(pattern, stripped) and len(stripped) < 80:
                    # Save previous section
                    if current_content:
                        content = "\n".join(current_content).strip()
                        if content:
                            sections[current_section] = content
                    current_section = section_name
                    current_content = []
                    matched = True
                    break

            if not matched:
                current_content.append(line)

        # Save last section
        if current_content:
            content = "\n".join(current_content).strip()
            if content:
                sections[current_section] = content

        return sections

    def _extract_contact_info(self, text: str) -> dict:
        """Extract email, phone, LinkedIn, GitHub from resume text."""
        contact = {}

        # Email
        email_match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
        if email_match:
            contact["email"] = email_match.group()

        # Phone
        phone_match = re.search(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}", text)
        if phone_match:
            contact["phone"] = phone_match.group().strip()

        # LinkedIn
        linkedin_match = re.search(r"linkedin\.com/in/[\w-]+", text, re.IGNORECASE)
        if linkedin_match:
            contact["linkedin"] = linkedin_match.group()

        # GitHub
        github_match = re.search(r"github\.com/[\w-]+", text, re.IGNORECASE)
        if github_match:
            contact["github"] = github_match.group()

        # Website
        website_match = re.search(r"https?://(?!.*linkedin|.*github)[\w.-]+\.\w+[\w/.-]*", text, re.IGNORECASE)
        if website_match:
            contact["website"] = website_match.group()

        return contact
