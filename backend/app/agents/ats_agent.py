"""
============================================================
CareerPilot AI — ATS (Applicant Tracking System) Agent
============================================================
Scores resumes against job descriptions using rule-based keyword
matching and section analysis.

Capabilities:
    - Extract important keywords from job descriptions
    - Match keywords against parsed resume text
    - Calculate ATS compatibility score (0-100)
    - Provide section-level feedback and missing keyword alerts
============================================================
"""

import re
from typing import Dict, List, Tuple
from collections import Counter


# ---- Common stop words to exclude ----
STOP_WORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "shall", "can", "need", "must",
    "it", "its", "that", "this", "these", "those", "i", "we", "you",
    "they", "he", "she", "my", "our", "your", "their", "not", "no",
    "so", "if", "then", "than", "also", "just", "as", "about", "up",
    "out", "into", "over", "after", "before", "between", "under",
    "again", "further", "once", "here", "there", "when", "where",
    "why", "how", "all", "each", "every", "both", "few", "more",
    "most", "other", "some", "such", "only", "own", "same", "too",
    "very", "any", "able", "etc", "via", "per", "using", "work",
    "working", "including", "role", "team", "company", "position",
    "looking", "join", "experience", "years", "strong", "knowledge",
    "understanding", "requirements", "responsibilities", "qualifications",
    "job", "opportunity", "ideal", "candidate", "apply", "required",
    "preferred", "minimum", "plus", "bonus", "equivalent",
}

# ---- High-value technical keywords (boost importance) ----
HIGH_VALUE_KEYWORDS = {
    "python", "javascript", "typescript", "react", "angular", "vue",
    "node", "express", "fastapi", "django", "flask", "java", "spring",
    "docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "git",
    "sql", "postgresql", "mongodb", "redis", "graphql", "rest",
    "api", "microservices", "agile", "scrum", "machine learning",
    "deep learning", "tensorflow", "pytorch", "nlp", "computer vision",
    "data science", "data engineering", "etl", "spark", "hadoop",
    "linux", "devops", "terraform", "jenkins", "github actions",
    "html", "css", "tailwind", "sass", "webpack", "vite",
    "c++", "c#", ".net", "rust", "go", "kotlin", "swift",
    "figma", "jira", "confluence", "postman",
}


class ATSAgent:
    """Scores resumes against job descriptions using keyword matching."""

    async def score_resume(
        self,
        resume_text: str,
        job_description: str,
        resume_sections: Dict[str, str] = None,
    ) -> dict:
        """
        Score a resume against a job description.

        Args:
            resume_text: Full text of the parsed resume
            job_description: Text of the target job description
            resume_sections: Optional parsed sections dict

        Returns:
            dict with: ats_score, matched_keywords, missing_keywords,
                       section_feedback, summary
        """
        # 1. Extract keywords from job description
        jd_keywords = self._extract_keywords(job_description)

        # 2. Normalize resume text
        resume_lower = resume_text.lower()

        # 3. Match keywords
        matched = []
        missing = []
        for kw, importance in jd_keywords:
            # Check for exact or fuzzy match
            if self._keyword_in_text(kw, resume_lower):
                matched.append(kw)
            else:
                missing.append({"keyword": kw, "importance": importance})

        # 4. Calculate score
        total_keywords = len(jd_keywords)
        if total_keywords == 0:
            ats_score = 50.0  # Neutral score if no keywords extracted
        else:
            # Weighted scoring: high-importance keywords count more
            total_weight = 0
            matched_weight = 0
            for kw, importance in jd_keywords:
                weight = 3 if importance == "high" else (2 if importance == "medium" else 1)
                total_weight += weight
                if kw in matched:
                    matched_weight += weight

            ats_score = round((matched_weight / total_weight) * 100, 1) if total_weight > 0 else 0

        # 5. Section feedback
        section_feedback = []
        if resume_sections:
            section_feedback = self._generate_section_feedback(
                resume_sections, jd_keywords, resume_lower
            )

        # 6. Summary
        summary = self._generate_summary(ats_score, len(matched), len(missing))

        return {
            "ats_score": ats_score,
            "matched_keywords": matched,
            "missing_keywords": missing,
            "section_feedback": section_feedback,
            "summary": summary,
        }

    def _extract_keywords(self, job_description: str) -> List[Tuple[str, str]]:
        """
        Extract important keywords from a job description.
        Returns list of (keyword, importance) tuples.
        """
        text = job_description.lower()
        # Remove special characters but keep slashes for tech terms
        text = re.sub(r"[^\w\s/\+\#\.]", " ", text)

        # Split into potential keywords (single words + bigrams)
        words = [w.strip(".") for w in text.split()]
        single_words = [w for w in words if len(w) > 2 and w not in STOP_WORDS]

        # Generate bigrams for multi-word tech terms
        bigrams = []
        for i in range(len(words) - 1):
            bigram = f"{words[i]} {words[i+1]}"
            if bigram.lower() in HIGH_VALUE_KEYWORDS:
                bigrams.append(bigram)

        # Count frequency
        word_freq = Counter(single_words)

        keywords = []
        seen = set()

        # Add bigrams first (higher priority)
        for bg in bigrams:
            if bg not in seen:
                keywords.append((bg, "high"))
                seen.add(bg)

        # Add single words by frequency
        for word, count in word_freq.most_common(50):
            if word not in seen and len(word) > 2:
                if word in HIGH_VALUE_KEYWORDS:
                    importance = "high"
                elif count >= 3:
                    importance = "high"
                elif count >= 2:
                    importance = "medium"
                else:
                    importance = "low"
                keywords.append((word, importance))
                seen.add(word)

        # Limit to top 30 keywords
        return keywords[:30]

    def _keyword_in_text(self, keyword: str, text: str) -> bool:
        """Check if a keyword exists in the text (flexible matching)."""
        kw = keyword.lower().strip()
        # Exact word boundary match
        pattern = r"\b" + re.escape(kw) + r"\b"
        try:
            if re.search(pattern, text):
                return True
        except re.error:
            pass
        # Fallback: simple substring
        return kw in text

    def _generate_section_feedback(
        self,
        sections: Dict[str, str],
        jd_keywords: List[Tuple[str, str]],
        resume_lower: str,
    ) -> List[dict]:
        """Generate feedback per resume section."""
        feedback = []

        section_configs = {
            "experience": {"weight": 35, "label": "Work Experience"},
            "skills": {"weight": 25, "label": "Skills"},
            "education": {"weight": 15, "label": "Education"},
            "summary": {"weight": 15, "label": "Summary/Objective"},
            "projects": {"weight": 10, "label": "Projects"},
        }

        for sec_key, config in section_configs.items():
            content = sections.get(sec_key, "")
            sec_lower = content.lower()

            if not content.strip():
                feedback.append({
                    "section": config["label"],
                    "score": 0,
                    "feedback": f"Section '{config['label']}' is missing from your resume.",
                    "missing_keywords": [],
                })
                continue

            # Check which JD keywords appear in this section
            sec_matched = []
            sec_missing = []
            for kw, importance in jd_keywords:
                if importance in ("high", "medium"):
                    if self._keyword_in_text(kw, sec_lower):
                        sec_matched.append(kw)
                    else:
                        sec_missing.append(kw)

            total_relevant = len(sec_matched) + len(sec_missing)
            if total_relevant > 0:
                sec_score = round((len(sec_matched) / total_relevant) * 100, 1)
            else:
                sec_score = 50.0

            # Generate feedback text
            if sec_score >= 80:
                fb_text = f"Excellent keyword coverage in {config['label']}."
            elif sec_score >= 60:
                fb_text = f"Good coverage, but consider adding: {', '.join(sec_missing[:3])}."
            elif sec_score >= 40:
                fb_text = f"Moderate coverage. Missing important keywords: {', '.join(sec_missing[:5])}."
            else:
                fb_text = f"Low keyword match. Strongly consider adding: {', '.join(sec_missing[:5])}."

            feedback.append({
                "section": config["label"],
                "score": sec_score,
                "feedback": fb_text,
                "missing_keywords": sec_missing[:10],
            })

        return feedback

    def _generate_summary(self, score: float, matched_count: int, missing_count: int) -> str:
        """Generate a human-readable ATS summary."""
        if score >= 85:
            return (
                f"Excellent ATS compatibility ({score}%). Your resume matches "
                f"{matched_count} key terms from the job description. "
                f"Strong candidate profile for this role."
            )
        elif score >= 70:
            return (
                f"Good ATS compatibility ({score}%). Matched {matched_count} keywords, "
                f"but {missing_count} relevant terms are missing. "
                f"Consider adding the missing keywords to improve your score."
            )
        elif score >= 50:
            return (
                f"Moderate ATS compatibility ({score}%). {missing_count} important keywords "
                f"are missing from your resume. Review the missing keywords list and "
                f"incorporate them naturally into your experience and skills sections."
            )
        else:
            return (
                f"Low ATS compatibility ({score}%). Your resume is missing {missing_count} "
                f"important keywords. Significant revision is recommended to match "
                f"the job description requirements."
            )
