"""
============================================================
CareerPilot AI — Mock Interview Agent (Phase 6)
============================================================
Generates role-specific behavioral and technical interview
questions and evaluates answers using a multi-dimensional rubric
(technical keywords, clarity, depth, and pacing).
============================================================
"""

from typing import List, Dict, Any, Optional
import re

# Comprehensive role-based interview question bank
INTERVIEW_QUESTION_BANK = {
    "Frontend Developer": [
        {
            "id": "fe_1",
            "question": "Can you explain how React 19's virtual DOM reconciliation and fiber architecture optimize render cycles?",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["reconciliation", "fiber", "diffing", "tree", "state", "batching", "concurrent", "virtual dom"],
            "hint": "Mention the fiber tree nodes, priority scheduling, and how diffing compares elements without repainting the entire real DOM.",
        },
        {
            "id": "fe_2",
            "question": "Describe a scenario where you faced significant web performance bottlenecks (such as slow Core Web Vitals). How did you diagnose and resolve them?",
            "category": "behavioral",
            "difficulty": "mid",
            "expected_keywords": ["lighthouse", "lcp", "cls", "lazy loading", "bundle", "memo", "code splitting", "cache", "profiler"],
            "hint": "Use the STAR method (Situation, Task, Action, Result) and mention specific profiling tools like Chrome DevTools or Lighthouse.",
        },
        {
            "id": "fe_3",
            "question": "How do you handle global client-side state versus server-cache state in large-scale modern applications?",
            "category": "system_design",
            "difficulty": "senior",
            "expected_keywords": ["zustand", "redux", "tanstack query", "react query", "cache", "invalidation", "optimistic", "stale"],
            "hint": "Differentiate between server data caching and synchronous client UI state like modals or theme preferences.",
        },
        {
            "id": "fe_4",
            "question": "Explain the difference between synchronous execution, Microtasks (Promises), and Macrotasks (setTimeout) in the JavaScript Event Loop.",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["call stack", "event loop", "microtask", "promise", "macrotask", "queue", "async", "single threaded"],
            "hint": "Explain queue order: call stack runs first, then all microtasks, then next macrotask from queue.",
        },
        {
            "id": "fe_5",
            "question": "How do you design accessible (a11y) components that adhere to WCAG 2.1 standards?",
            "category": "technical",
            "difficulty": "junior",
            "expected_keywords": ["aria", "semantic", "keyboard", "focus", "contrast", "screen reader", "wcag", "alt"],
            "hint": "Discuss semantic HTML tags, keyboard navigation tabindex, and ARIA attributes.",
        },
    ],

    "Backend Developer": [
        {
            "id": "be_1",
            "question": "How does asynchronous I/O work in Python with asyncio and FastAPI, and when should you avoid using async?",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["event loop", "coroutine", "non-blocking", "cpu bound", "gil", "threadpool", "await", "multiprocessing"],
            "hint": "Clarify that I/O-bound tasks benefit from async, whereas CPU-intensive tasks block the event loop unless offloaded.",
        },
        {
            "id": "be_2",
            "question": "How do you optimize slow relational database queries in PostgreSQL when dealing with millions of records?",
            "category": "technical",
            "difficulty": "senior",
            "expected_keywords": ["explain analyze", "index", "b-tree", "join", "partitioning", "connection pool", "vacuum", "query planner"],
            "hint": "Discuss EXPLAIN ANALYZE, indexing strategies, eliminating sequential scans, and connection pooling.",
        },
        {
            "id": "be_3",
            "question": "Explain your approach to designing a secure, stateless authentication system using JWT tokens and refresh token rotation.",
            "category": "system_design",
            "difficulty": "mid",
            "expected_keywords": ["jwt", "secret key", "refresh token", "rotation", "blacklist", "bcrypt", "oauth2", "expiration"],
            "hint": "Highlight short-lived access tokens, secure HTTP-only cookies, and invalidating compromised refresh tokens.",
        },
        {
            "id": "be_4",
            "question": "Tell me about a time you handled a critical production outage or database lock contention. How did you handle communication and rollback?",
            "category": "behavioral",
            "difficulty": "mid",
            "expected_keywords": ["monitoring", "incident", "rollback", "post-mortem", "logs", "metrics", "lock", "root cause"],
            "hint": "Focus on calm systematic triage: logs, isolating the issue, mitigating impact, and conducting a blameless post-mortem.",
        },
        {
            "id": "be_5",
            "question": "When designing distributed microservices, how do you handle data consistency and distributed transactions?",
            "category": "system_design",
            "difficulty": "senior",
            "expected_keywords": ["saga", "idempotency", "eventual consistency", "kafka", "rabbitmq", "outbox", "acid", "compensation"],
            "hint": "Discuss the Saga pattern, outbox pattern, and idempotency keys instead of 2-phase commit.",
        },
    ],

    "AI/ML Engineer": [
        {
            "id": "ai_1",
            "question": "Explain the architecture of a Retrieval-Augmented Generation (RAG) system and techniques to mitigate semantic hallucination.",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["embeddings", "vector store", "chunking", "retrieval", "reranking", "cosine", "prompt", "hallucination", "context"],
            "hint": "Discuss chunk overlap, dense vs sparse retrieval, cross-encoder rerankers, and prompt grounding.",
        },
        {
            "id": "ai_2",
            "question": "What is the difference between Self-Attention and Multi-Head Attention in the Transformer architecture?",
            "category": "technical",
            "difficulty": "senior",
            "expected_keywords": ["query", "key", "value", "softmax", "dimension", "representation", "projection", "subspace"],
            "hint": "Mention QKV projections and how multiple heads allow the model to jointly attend to information at different positions.",
        },
        {
            "id": "ai_3",
            "question": "How do you evaluate and benchmark LLM outputs in production when ground truth labels do not exist?",
            "category": "system_design",
            "difficulty": "mid",
            "expected_keywords": ["ragas", "llm-as-a-judge", "faithfulness", "groundedness", "latency", "hallucination", "bleu", "human evaluation"],
            "hint": "Discuss frameworks like Ragas or TruLens, measuring context relevance, answer groundedness, and LLM-as-a-judge rubrics.",
        },
        {
            "id": "ai_4",
            "question": "Explain Parameter-Efficient Fine-Tuning (PEFT) and how LoRA (Low-Rank Adaptation) reduces GPU VRAM consumption.",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["lora", "low rank", "decomposition", "matrices", "frozen", "adapter", "vram", "weights"],
            "hint": "Describe freezing base weights and training rank decomposition matrices A and B with rank r.",
        },
    ],

    "Full Stack Developer": [
        {
            "id": "fs_1",
            "question": "Walk me through how you architect an end-to-end feature: from frontend state and forms to API validation and relational database tables.",
            "category": "system_design",
            "difficulty": "mid",
            "expected_keywords": ["react", "validation", "api", "schema", "orm", "database", "error handling", "migration"],
            "hint": "Walk chronologically: UI inputs, client validation, REST endpoint, Pydantic schema, database migration, and optimistic UI update.",
        },
        {
            "id": "fs_2",
            "question": "How do you ensure zero-downtime deployments when changing database schemas with column alterations?",
            "category": "technical",
            "difficulty": "senior",
            "expected_keywords": ["alembic", "migration", "backward compatible", "expand contract", "rollback", "blue-green"],
            "hint": "Discuss the expand/contract pattern: add nullable column first, deploy code writing to both, backfill, then drop old column.",
        },
        {
            "id": "fs_3",
            "question": "Tell me about a conflict or disagreement you had with a team member about technical architecture. How did you resolve it?",
            "category": "behavioral",
            "difficulty": "mid",
            "expected_keywords": ["prototype", "data", "benchmark", "trade-offs", "consensus", "listening", "align"],
            "hint": "Show empathy, building prototypes to test assumptions with objective benchmarks rather than ego.",
        },
    ],

    "DevOps Engineer": [
        {
            "id": "do_1",
            "question": "Explain Kubernetes Pod scheduling, health probes (liveness vs readiness vs startup), and graceful termination.",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["liveness", "readiness", "startup", "sigterm", "scheduler", "kubelet", "ingress", "pod"],
            "hint": "Contrast liveness (restarts pod) with readiness (removes pod from service endpoints until ready).",
        },
        {
            "id": "do_2",
            "question": "How do you design a secure, automated CI/CD pipeline using GitHub Actions with vulnerability scanning and secret rotation?",
            "category": "system_design",
            "difficulty": "mid",
            "expected_keywords": ["github actions", "oidc", "secrets", "trivy", "docker", "staging", "automated tests", "registry"],
            "hint": "Mention OIDC for AWS authentication without long-lived credentials, Trivy image scanning, and automated rollback.",
        },
    ],

    "Data Analyst": [
        {
            "id": "da_1",
            "question": "Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK() in SQL window functions.",
            "category": "technical",
            "difficulty": "junior",
            "expected_keywords": ["partition by", "order by", "tie", "duplicate", "sequence", "gap", "dense_rank"],
            "hint": "Explain how ties are handled: ROW_NUMBER increments sequentially, RANK leaves gaps, DENSE_RANK does not leave gaps.",
        },
        {
            "id": "da_2",
            "question": "How do you analyze user retention using cohort analysis in SQL or Pandas?",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["cohort", "retention", "signup date", "activity", "churn", "group by", "percentage"],
            "hint": "Group users by registration month/week and calculate percentage active across consecutive periods.",
        },
    ],

    "Software Engineer": [
        {
            "id": "se_1",
            "question": "Explain the time complexity differences between a hash map lookup, a binary search tree search, and a linear scan. When would you choose each?",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["o(1)", "o(log n)", "o(n)", "hash", "collision", "balanced", "bst", "amortized", "trade-off"],
            "hint": "Discuss average vs worst-case complexities and when hash collisions degrade performance.",
        },
        {
            "id": "se_2",
            "question": "Walk me through how you would design a URL shortener service like bit.ly, including database design, encoding strategy, and handling high traffic.",
            "category": "system_design",
            "difficulty": "senior",
            "expected_keywords": ["base62", "hash", "database", "cache", "redirect", "collision", "sharding", "analytics", "scale"],
            "hint": "Mention base62 encoding, collision handling, Redis caching for hot URLs, and horizontal scaling.",
        },
        {
            "id": "se_3",
            "question": "Describe the SOLID principles in object-oriented design. Give a real example where violating one of them caused problems in your codebase.",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["single responsibility", "open closed", "liskov", "interface segregation", "dependency inversion", "refactor", "coupling"],
            "hint": "Use a concrete example showing how violating Single Responsibility led to tightly coupled, hard-to-test code.",
        },
        {
            "id": "se_4",
            "question": "Tell me about a time you had to debug a complex production issue. What was your systematic approach to identifying and fixing the root cause?",
            "category": "behavioral",
            "difficulty": "mid",
            "expected_keywords": ["logs", "monitoring", "reproduce", "isolate", "root cause", "post-mortem", "metrics", "rollback"],
            "hint": "Use STAR format. Emphasize systematic triage: logs, isolating variables, hypothesis testing, and post-mortem documentation.",
        },
    ],

    "Cloud Architect": [
        {
            "id": "ca_1",
            "question": "How do you design a multi-region, highly available cloud architecture on AWS? Discuss failover strategies and data replication.",
            "category": "system_design",
            "difficulty": "senior",
            "expected_keywords": ["multi-region", "route 53", "failover", "rds", "aurora", "replication", "s3", "availability zone", "latency"],
            "hint": "Discuss active-active vs active-passive, Route 53 health checks, Aurora Global Database, and S3 cross-region replication.",
        },
        {
            "id": "ca_2",
            "question": "Explain Infrastructure as Code (IaC) principles. How do you manage state, handle drift, and organize Terraform modules for a large organization?",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["terraform", "state", "remote backend", "module", "drift", "plan", "apply", "workspace", "lock"],
            "hint": "Discuss remote state backends (S3+DynamoDB), module composition, workspace isolation, and drift detection with terraform plan.",
        },
    ],

    "Cybersecurity Engineer": [
        {
            "id": "cy_1",
            "question": "Explain the OWASP Top 10. How would you implement defenses against SQL injection, XSS, and CSRF in a web application?",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["owasp", "injection", "parameterized", "sanitize", "xss", "csp", "csrf", "token", "input validation"],
            "hint": "Discuss parameterized queries for SQL injection, Content Security Policy for XSS, and CSRF tokens for form protection.",
        },
        {
            "id": "cy_2",
            "question": "How do you conduct a penetration test on a web application? Walk me through your methodology from reconnaissance to reporting.",
            "category": "system_design",
            "difficulty": "senior",
            "expected_keywords": ["reconnaissance", "enumeration", "scanning", "exploitation", "post-exploitation", "report", "nmap", "burp"],
            "hint": "Follow methodology: information gathering, vulnerability scanning, exploitation, privilege escalation, reporting with remediation.",
        },
    ],

    "QA / Test Engineer": [
        {
            "id": "qa_1",
            "question": "Explain the testing pyramid. How do you decide the right balance between unit tests, integration tests, and end-to-end tests?",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["pyramid", "unit", "integration", "e2e", "fast", "flaky", "coverage", "mock", "stub"],
            "hint": "More unit tests at base (fast, stable), fewer integration in middle, minimal E2E at top (slow, flaky). Discuss trade-offs.",
        },
        {
            "id": "qa_2",
            "question": "How do you handle flaky tests in a CI pipeline? What strategies do you use to identify and eliminate test flakiness?",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["flaky", "retry", "quarantine", "deterministic", "timeout", "race condition", "isolation", "parallel"],
            "hint": "Discuss quarantining flaky tests, analyzing race conditions, ensuring test isolation, and avoiding shared state.",
        },
    ],

    "Game Developer": [
        {
            "id": "gd_1",
            "question": "Explain the game loop pattern. How do fixed timestep and variable timestep updates differ, and when would you use each?",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["game loop", "fixed", "variable", "delta time", "physics", "render", "interpolation", "accumulator"],
            "hint": "Fixed timestep for deterministic physics simulation, variable timestep for rendering. Use accumulator pattern for hybrid approach.",
        },
        {
            "id": "gd_2",
            "question": "How do you optimize rendering performance in a 3D game? Discuss techniques for reducing draw calls and improving frame rates.",
            "category": "technical",
            "difficulty": "senior",
            "expected_keywords": ["draw call", "batching", "lod", "culling", "occlusion", "instancing", "shader", "profiler", "texture atlas"],
            "hint": "Discuss frustum culling, occlusion culling, LOD systems, static/dynamic batching, and GPU instancing.",
        },
    ],

    "Blockchain Developer": [
        {
            "id": "bc_1",
            "question": "Explain the reentrancy vulnerability in Solidity smart contracts. How do you prevent it, and what was the DAO hack?",
            "category": "technical",
            "difficulty": "senior",
            "expected_keywords": ["reentrancy", "external call", "checks-effects-interactions", "mutex", "reentrancy guard", "dao", "withdraw"],
            "hint": "Discuss checks-effects-interactions pattern, using ReentrancyGuard from OpenZeppelin, and the historic DAO exploit.",
        },
        {
            "id": "bc_2",
            "question": "How do you design a gas-efficient smart contract? What patterns and techniques reduce gas consumption on Ethereum?",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["gas", "storage", "memory", "calldata", "packing", "mapping", "events", "minimal proxy", "eip-1167"],
            "hint": "Discuss storage vs memory vs calldata costs, struct packing, using events instead of storage, and minimal proxy patterns.",
        },
    ],

    "iOS Developer": [
        {
            "id": "ios_1",
            "question": "Explain Swift's memory management model. How do ARC, strong references, weak references, and retain cycles work?",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["arc", "strong", "weak", "unowned", "retain cycle", "reference counting", "deinit", "closure capture"],
            "hint": "Discuss automatic reference counting, how closures can capture self strongly creating cycles, and using [weak self].",
        },
        {
            "id": "ios_2",
            "question": "How do you architect a large-scale iOS app? Compare MVC, MVVM, and The Composable Architecture (TCA).",
            "category": "system_design",
            "difficulty": "senior",
            "expected_keywords": ["mvc", "mvvm", "tca", "coordinator", "dependency injection", "testable", "state", "unidirectional"],
            "hint": "Discuss MVC's massive view controller problem, MVVM's data binding, and TCA's unidirectional data flow with testability.",
        },
    ],

    "Android Developer": [
        {
            "id": "and_1",
            "question": "Explain the Android Activity lifecycle. What happens during configuration changes like screen rotation, and how do you preserve state?",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["oncreate", "onresume", "ondestroy", "savedinstancestate", "viewmodel", "configuration change", "lifecycle"],
            "hint": "Discuss ViewModel surviving config changes, SavedStateHandle for process death, and onSaveInstanceState for transient UI state.",
        },
        {
            "id": "and_2",
            "question": "How does Jetpack Compose differ from the traditional XML View system? What advantages does recomposition provide?",
            "category": "technical",
            "difficulty": "mid",
            "expected_keywords": ["declarative", "recomposition", "state", "remember", "composable", "xml", "imperative", "side effect"],
            "hint": "Contrast imperative XML (find view, set property) with declarative Compose (describe UI as function of state, smart recomposition).",
        },
    ],

    "Site Reliability Engineer": [
        {
            "id": "sre_1",
            "question": "What are SLIs, SLOs, and SLAs? How do you define error budgets and use them to balance reliability with feature velocity?",
            "category": "system_design",
            "difficulty": "mid",
            "expected_keywords": ["sli", "slo", "sla", "error budget", "availability", "latency", "reliability", "burn rate"],
            "hint": "SLI = metric measured, SLO = target threshold, SLA = business contract. Error budget = 100% - SLO, consumed by incidents.",
        },
        {
            "id": "sre_2",
            "question": "Describe your approach to incident management. How do you structure on-call, escalation, and blameless post-mortems?",
            "category": "behavioral",
            "difficulty": "mid",
            "expected_keywords": ["on-call", "runbook", "escalation", "blameless", "post-mortem", "incident commander", "timeline", "action items"],
            "hint": "Discuss incident roles (commander, scribe), communication channels, runbook-driven response, and blameless post-mortem culture.",
        },
    ],
}


class InterviewAgent:
    """Manages mock interview sessions, question selection, and answer evaluation."""

    async def generate_questions(
        self,
        role: str,
        count: int = 5,
        difficulty: str = "mid",
    ) -> List[Dict[str, Any]]:
        """
        Generate or retrieve role-appropriate interview questions.
        """
        # Find matching role questions
        matched_key = "Frontend Developer"
        for key in INTERVIEW_QUESTION_BANK.keys():
            if key.lower() in role.lower() or role.lower() in key.lower():
                matched_key = key
                break

        bank = INTERVIEW_QUESTION_BANK.get(matched_key, INTERVIEW_QUESTION_BANK["Frontend Developer"])
        
        # Filter or sample desired count
        selected = bank[:count]
        if len(selected) < count:
            # Pad with general tech questions from other categories
            extra = INTERVIEW_QUESTION_BANK["Frontend Developer"] + INTERVIEW_QUESTION_BANK["Backend Developer"]
            for q in extra:
                if q not in selected and len(selected) < count:
                    selected.append(q)

        return selected

    async def evaluate_answer(
        self,
        question_dict: Dict[str, Any],
        answer_text: str,
        duration_sec: int = 0,
        visual_metrics: Optional[Dict[str, Any]] = None,
        speech_metrics: Optional[Dict[str, Any]] = None,
        avatar_latency_ms: Optional[float] = None,
    ) -> Dict[str, Any]:
        """
        Evaluates candidate answer against scoring rubric:
        - Keyword coverage (40%)
        - Technical depth & completeness (30%)
        - Clarity & structure (30%)
        Additionally incorporates speech metrics (fillers, fluency, WPM)
        and computer vision behavioral telemetry (face visibility, gaze, posture).
        """
        clean_text = answer_text.strip()
        word_count = len(clean_text.split())

        # Common spoken filler words
        filler_patterns = [
            r"\bum\b", r"\buh\b", r"\blike\b", r"\byou know\b",
            r"\bactually\b", r"\bbasically\b", r"\bsort of\b",
            r"\bkind of\b", r"\bi mean\b", r"\bliterally\b"
        ]
        lower_answer = clean_text.lower()
        detected_fillers = []
        total_filler_count = 0
        for pattern in filler_patterns:
            matches = re.findall(pattern, lower_answer)
            if matches:
                detected_fillers.append(matches[0].strip())
                total_filler_count += len(matches)

        filler_density_pct = round((total_filler_count / max(word_count, 1)) * 100, 1)

        # Speaking pace (Words Per Minute)
        if duration_sec > 0:
            words_per_minute = round((word_count / duration_sec) * 60, 1)
        else:
            words_per_minute = speech_metrics.get("wpm", 0.0) if speech_metrics else 0.0

        # Response Fluency (0 - 100): transitions, cadence, low filler density
        structural_markers = [
            "because", "for example", "specifically", "however",
            "therefore", "firstly", "in order to", "result", "benefit",
            "consequently", "furthermore", "in contrast"
        ]
        structure_count = sum(1 for m in structural_markers if m in lower_answer)
        fluency_penalty = min(total_filler_count * 4.0, 30.0)
        fluency_score = min(max(50.0 + (structure_count * 7.0) - fluency_penalty, 25.0), 100.0)

        # Vocal clarity score based on structural articulation
        vocal_clarity = min(max(40.0 + (structure_count * 8.0) - (fluency_penalty * 0.5), 30.0), 100.0)

        speech_analysis = {
            "words_per_minute": words_per_minute,
            "word_count": word_count,
            "duration_sec": duration_sec,
            "filler_words_detected": detected_fillers,
            "filler_count": total_filler_count,
            "filler_density_pct": filler_density_pct,
            "fluency_score": round(fluency_score, 1),
            "vocal_clarity_score": round(vocal_clarity, 1),
            "pacing_category": (
                "fast" if words_per_minute > 175
                else "deliberate" if words_per_minute < 80 and duration_sec > 30
                else "optimal"
            ),
        }

        # Analyze Computer Vision Behavioral Metrics if provided
        behavioral_insights = None
        if visual_metrics:
            face_detected = visual_metrics.get("face_detected", True)
            face_visible_ratio = visual_metrics.get("face_visibility_ratio", 1.0)
            camera_facing_ratio = visual_metrics.get("camera_facing_ratio", 0.85)
            eye_contact_ratio = visual_metrics.get("eye_contact_ratio", 0.80)
            posture_stability = visual_metrics.get("posture_stability_score", 85.0)
            head_movement = visual_metrics.get("head_movement_stability", "stable")

            notes = []
            if face_visible_ratio >= 0.85:
                notes.append("Consistent face visibility maintained.")
            elif face_visible_ratio < 0.5:
                notes.append("Candidate was frequently out of frame.")

            if camera_facing_ratio >= 0.75:
                notes.append("High camera-facing engagement.")
            else:
                notes.append("Frequent head turns away from screen center.")

            if posture_stability >= 75:
                notes.append("Upright and stable physical posture.")
            else:
                notes.append("Observable posture shifting or slouching.")

            behavioral_insights = {
                "face_detected": face_detected,
                "face_visibility_ratio": face_visible_ratio,
                "camera_facing_ratio": camera_facing_ratio,
                "eye_contact_ratio": eye_contact_ratio,
                "posture_stability_score": posture_stability,
                "head_movement_stability": head_movement,
                "observable_feedback": " ".join(notes),
            }

        if word_count < 5:
            return {
                "score": 15.0,
                "feedback": "Answer was too brief. Elaborate with specific technical principles, concrete examples, and trade-offs.",
                "matched_keywords": [],
                "missing_keywords": question_dict.get("expected_keywords", [])[:5],
                "clarity_score": 20.0,
                "pacing_feedback": "Rushed response. Take time to structure your thoughts using the STAR or Problem-Solution pattern.",
                "behavioral_insights": behavioral_insights,
                "speech_analysis": speech_analysis,
                "avatar_latency_ms": avatar_latency_ms,
            }

        # 1. Technical Keyword Match (0 - 40 points)
        expected_kws = question_dict.get("expected_keywords", [])
        matched = []
        missing = []

        for kw in expected_kws:
            if kw.lower() in lower_answer:
                matched.append(kw)
            else:
                missing.append(kw)

        keyword_ratio = len(matched) / len(expected_kws) if expected_kws else 0.7
        keyword_score = min(keyword_ratio * 40.0, 40.0)

        # 2. Depth & Detail (0 - 30 points)
        if word_count < 20:
            depth_score = 12.0
        elif word_count < 40:
            depth_score = 22.0
        elif word_count <= 250:
            depth_score = 30.0
        else:
            depth_score = 25.0  # slightly long-winded

        # 3. Clarity & Structure (0 - 30 points)
        clarity_score = min(18.0 + (structure_count * 3.0), 30.0)

        total_score = round(keyword_score + depth_score + clarity_score, 1)
        total_score = max(min(total_score, 100.0), 10.0)

        # Pacing feedback
        if duration_sec > 0:
            if words_per_minute > 180:
                pacing_feedback = f"Pacing was brisk (~{words_per_minute:.0f} wpm). Aim for ~130-150 wpm for maximum conversational clarity."
            elif words_per_minute < 70 and duration_sec > 40:
                pacing_feedback = "Pacing was somewhat slow. Practice speaking with steady momentum and confidence."
            else:
                pacing_feedback = f"Excellent conversational pacing (~{words_per_minute:.0f} wpm)."
        else:
            pacing_feedback = "Good response delivery."

        # Actionable feedback generation
        feedback_points = []
        if len(matched) >= 3:
            feedback_points.append(f"Strong grasp of core concepts ({', '.join(matched[:3])}).")
        if missing:
            feedback_points.append(f"Consider mentioning {', '.join(missing[:3])} to add technical depth.")
        if total_filler_count > 3:
            feedback_points.append(f"Noticeable filler words ({', '.join(detected_fillers[:2])}); practice pauses instead of verbal fillers.")
        if word_count < 35:
            feedback_points.append("Expand on trade-offs or real-world implementation challenges.")
        elif word_count >= 50:
            feedback_points.append("Well-articulated explanation with good supporting context.")

        feedback = " ".join(feedback_points)

        return {
            "score": total_score,
            "feedback": feedback,
            "matched_keywords": matched,
            "missing_keywords": missing,
            "clarity_score": round(clarity_score * (100 / 30), 1),
            "pacing_feedback": pacing_feedback,
            "behavioral_insights": behavioral_insights,
            "speech_analysis": speech_analysis,
            "avatar_latency_ms": avatar_latency_ms,
        }

    def compute_srs_confidence_score(
        self,
        visual_summary: Optional[Dict[str, Any]] = None,
        speech_summary: Optional[Dict[str, Any]] = None,
        avg_clarity_score: float = 75.0,
    ) -> Dict[str, Any]:
        """
        Implements the SRS Confidence Score formula:
            - Eye contact: 30%
            - Posture: 25%
            - Vocal clarity: 25%
            - Response fluency: 20%

        Handles missing signals gracefully (e.g., camera disabled or video format omitted).
        """
        # 1. Vocal clarity (25% weight)
        vocal_clarity_val = avg_clarity_score
        if speech_summary and "vocal_clarity_score" in speech_summary:
            vocal_clarity_val = speech_summary["vocal_clarity_score"]

        # 2. Response fluency (20% weight)
        fluency_val = 75.0
        if speech_summary and "fluency_score" in speech_summary:
            fluency_val = speech_summary["fluency_score"]

        # 3. Eye contact (30% weight) & Posture (25% weight)
        visual_available = bool(
            visual_summary
            and visual_summary.get("camera_active", True)
            and visual_summary.get("face_detected", True)
        )

        if visual_available:
            eye_contact_ratio = visual_summary.get("eye_contact_ratio", 0.75)
            # Normalize 0.0 - 1.0 to 0 - 100 scale with conversational baseline
            eye_contact_score = round(min(max(eye_contact_ratio * 100.0, 10.0), 100.0), 1)

            posture_score = round(
                float(visual_summary.get("posture_stability_score", 80.0)), 1
            )
            posture_score = min(max(posture_score, 10.0), 100.0)

            # Standard formula: 30% eye contact + 25% posture + 25% vocal clarity + 20% fluency
            final_score = round(
                (0.30 * eye_contact_score)
                + (0.25 * posture_score)
                + (0.25 * vocal_clarity_val)
                + (0.20 * fluency_val),
                1
            )

            breakdown = {
                "eye_contact": {
                    "score": eye_contact_score,
                    "weight_pct": 30,
                    "status": "measured",
                    "metric_label": "Approximate Eye Contact & Camera Focus",
                },
                "posture": {
                    "score": posture_score,
                    "weight_pct": 25,
                    "status": "measured",
                    "metric_label": "Posture Stability & Upright Alignment",
                },
                "vocal_clarity": {
                    "score": round(vocal_clarity_val, 1),
                    "weight_pct": 25,
                    "status": "measured",
                    "metric_label": "Vocal Clarity & Structured Articulation",
                },
                "response_fluency": {
                    "score": round(fluency_val, 1),
                    "weight_pct": 20,
                    "status": "measured",
                    "metric_label": "Response Cadence & Low Filler Density",
                },
            }
            formula_applied = "Standard Model: Eye Contact (30%) + Posture (25%) + Vocal Clarity (25%) + Response Fluency (20%)"
        else:
            # Video not active: missing signal handling with documented normalization
            eye_contact_score = None
            posture_score = None

            # Re-normalize vocal clarity (55.5%) + response fluency (44.5%) = 100%
            final_score = round(
                (vocal_clarity_val * 0.555) + (fluency_val * 0.445), 1
            )

            breakdown = {
                "eye_contact": {
                    "score": None,
                    "weight_pct": 0,
                    "status": "unavailable (video disabled or face unobserved)",
                    "metric_label": "Approximate Eye Contact & Camera Focus",
                },
                "posture": {
                    "score": None,
                    "weight_pct": 0,
                    "status": "unavailable (video disabled or face unobserved)",
                    "metric_label": "Posture Stability & Upright Alignment",
                },
                "vocal_clarity": {
                    "score": round(vocal_clarity_val, 1),
                    "weight_pct": 55,
                    "status": "measured",
                    "metric_label": "Vocal Clarity & Structured Articulation (Normalized)",
                },
                "response_fluency": {
                    "score": round(fluency_val, 1),
                    "weight_pct": 45,
                    "status": "measured",
                    "metric_label": "Response Cadence & Low Filler Density (Normalized)",
                },
            }
            formula_applied = "Normalized Audio-Only: Vocal Clarity (55.5%) + Response Fluency (44.5%) [Visual indicators unavailable]"

        return {
            "confidence_score": final_score,
            "visual_signals_available": visual_available,
            "breakdown": breakdown,
            "formula_applied": formula_applied,
        }

    @staticmethod
    def get_interpretation_limitation_notice() -> str:
        """
        Mandatory scientific and ethical interpretation notice required by SRS.
        """
        return (
            "Observable Interview Behaviour Notice: Visual indicators (face visibility, "
            "camera-facing behaviour, approximate gaze direction, head movement, and posture) "
            "are measured via real-time browser optical analysis to provide presentation feedback. "
            "In alignment with scientific standards and AI ethics, these indicators do NOT "
            "purport to determine a candidate's actual inner honesty, intelligence, personality, "
            "competence, or psychological state. They are presented solely as observable communication signals."
        )

    @classmethod
    def handle_interview_conversation(
        cls,
        message: str,
        persona: str = "sarah",
        role: str = "Software Engineer",
        dialogue_state: str = "intro",
        candidate_name: Optional[str] = None,
        language: str = "auto",
    ) -> Dict[str, Any]:
        """
        Handle conversational warm-up, self-introduction, Q&A, and bilingual
        Urdu/English dialogue with the avatar before technical questions begin.
        """
        import httpx
        from app.config import settings

        msg_clean = message.strip()

        # 1. Detect language (Urdu script, Roman Urdu, or English)
        has_urdu_script = bool(re.search(r"[\u0600-\u06FF]", msg_clean))
        roman_urdu_tokens = {
            "mera", "meri", "naam", "aap", "kaise", "kaisa", "kaisi", "theek", "haan",
            "shuru", "karein", "karna", "salam", "assalam", "ji", "acha", "batao",
            "mujhy", "kar", "hain", "hoon", "shukriya", "karen", "chalo", "bilkul",
            "tayyar", "kaun", "kya", "kyun", "kahan"
        }
        words = set(re.findall(r"\b\w+\b", msg_clean.lower()))
        is_roman_urdu = len(words.intersection(roman_urdu_tokens)) >= 1

        if has_urdu_script:
            detected_lang = "ur"
        elif is_roman_urdu:
            detected_lang = "roman_urdu"
        else:
            detected_lang = "en"

        # 2. Extract candidate name if not yet known
        extracted_name = candidate_name
        if not extracted_name:
            name_match = re.search(
                r"(?:my name is|i am|i'm|call me|this is|mera naam|naam hai|naam)\s+([A-Za-z]+)",
                msg_clean,
                re.IGNORECASE,
            )
            if name_match:
                extracted_name = name_match.group(1).title()

        # 3. Detect readiness to start questions
        ready_pattern = r"\b(yes|ready|start|let's start|let's begin|sure|yep|yeah|let's go|begin|okay|ok|i am ready|i'm ready|haan|shuru|karein|chalo|ji|bilkul|tayyar)\b"
        is_ready = bool(re.search(ready_pattern, msg_clean, re.IGNORECASE))

        # Persona title & tone
        if persona == "marcus":
            interviewer_name = "Marcus Vance"
            interviewer_role = "VP of Engineering & Systems Architect"
        else:
            interviewer_name = "Sarah Chen"
            interviewer_role = "Lead Technical Recruiter & Talent Partner"

        # 4. Optional Gemini 1.5 Flash LLM call if API key configured
        gemini_key = getattr(settings, "GEMINI_API_KEY", "") or getattr(settings, "GOOGLE_API_KEY", "")
        if gemini_key:
            try:
                system_prompt = (
                    f"You are {interviewer_name}, {interviewer_role} at a top tech company. "
                    f"You are having a live voice conversation with a candidate interviewing for {role}. "
                    f"Candidate says: '{msg_clean}'. "
                    f"Candidate name (if known): {extracted_name or 'Candidate'}. "
                    f"Current stage: {dialogue_state}. "
                    f"Detected language: {detected_lang}. "
                    "Rules: "
                    "1. Respond directly, warmly, and concisely (2 to 3 sentences maximum) as if speaking aloud over a video call. "
                    "2. If the candidate speaks Urdu or Roman Urdu, reply fluently in the SAME language (Roman Urdu or Urdu script). "
                    "3. If they just introduced themselves, acknowledge their name and background warmly, and ask: 'Are you ready to begin our interview questions?' "
                    "4. If they indicated readiness or say yes/start, say excellent let's begin our first question. "
                    "5. If they asked a question about you or the role, answer it conversationally. "
                    "Do NOT include stage directions or markdown asterisks."
                )
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
                with httpx.Client(timeout=4.0) as client:
                    resp = client.post(url, json={"contents": [{"parts": [{"text": system_prompt}]}]})
                    if resp.status_code == 200:
                        res_json = resp.json()
                        llm_reply = res_json["candidates"][0]["content"]["parts"][0]["text"].strip()
                        if llm_reply:
                            return {
                                "reply": llm_reply,
                                "detected_language": detected_lang,
                                "candidate_name": extracted_name,
                                "proceed_to_questions": is_ready,
                                "next_dialogue_state": "in_questions" if is_ready else "ready_check",
                            }
            except Exception as gemini_err:
                print(f"[INFO] Gemini conversational fallback: {gemini_err}")

        # 5. Natural High-Fidelity Rule-Based Conversational Engine
        name_greeting = f", {extracted_name}" if extracted_name else ""

        # Case A: Candidate confirms readiness to begin
        if is_ready:
            if detected_lang == "ur":
                reply = f"بہترین! چلیے {role} کے لیے پہلا سوال شروع کرتے ہیں۔"
            elif detected_lang == "roman_urdu":
                reply = f"Zabardast! Chaliye {role} position ke liye pehla sawal shuru kartay hain."
            else:
                reply = f"Awesome! Let's dive right into our first question for the {role} position."
            return {
                "reply": reply,
                "detected_language": detected_lang,
                "candidate_name": extracted_name,
                "proceed_to_questions": True,
                "next_dialogue_state": "in_questions",
            }

        # Case B: Candidate introduces themselves
        if dialogue_state == "intro" or extracted_name or any(k in msg_clean.lower() for k in ["experience", "developer", "engineer", "student", "working", "background", "mern", "python", "react"]):
            if detected_lang == "ur":
                reply = (
                    f"آپ سے مل کر بہت خوشی ہوئی{name_greeting}! آپ کا بیک گراؤنڈ بہت اچھا ہے۔ "
                    f"کیا آپ انٹرویو شروع کرنے کے لیے تیار ہیں؟ جب آپ تیار ہوں تو 'جی شروع کریں' کہیں۔"
                )
            elif detected_lang == "roman_urdu":
                reply = (
                    f"Bohot achha laga aapse mil kar{name_greeting}! Aapka background bohot zabardast hai. "
                    f"Kya aap interview questions ke liye tayar hain? Jab aap ready hon, 'Haan shuru karein' ya 'Yes' bolein."
                )
            else:
                reply = (
                    f"It's a pleasure to meet you{name_greeting}! Thank you for sharing your background with me. "
                    f"Whenever you're ready to start the interview questions, say 'Yes' or 'Let's start'!"
                )
            return {
                "reply": reply,
                "detected_language": detected_lang,
                "candidate_name": extracted_name,
                "proceed_to_questions": False,
                "next_dialogue_state": "ready_check",
            }

        # Case C: Candidate asks how the interviewer is / chit-chat
        if any(q in msg_clean.lower() for q in ["how are you", "aap kaise", "kasa ho", "kase ho", "kaise hain"]):
            if detected_lang == "roman_urdu":
                reply = f"Main bilkul theek hoon, poochne ka bohot shukriya! Main aaj aapke session ke liye bohot excited hoon. Jab aap tayar hon, batayein taake pehla question shuru karein."
            elif detected_lang == "ur":
                reply = f"میں بالکل ٹھیک ہوں، پوچھنے کا شکریہ! میں آج کے انٹرویو کے لیے پرجوش ہوں۔ جب آپ تیار ہوں تو بتائیں۔"
            else:
                reply = f"I'm doing wonderful, thank you for asking! I'm really looking forward to our session today. Let me know whenever you'd like to begin."
            return {
                "reply": reply,
                "detected_language": detected_lang,
                "candidate_name": extracted_name,
                "proceed_to_questions": False,
                "next_dialogue_state": "ready_check",
            }

        # Default conversational acknowledgment
        if detected_lang == "roman_urdu":
            reply = f"Theek hai{name_greeting}! Jab bhi aap pehle question ke liye ready hon, 'Haan' ya 'Start' bolein."
        elif detected_lang == "ur":
            reply = f"ٹھیک ہے! جب بھی آپ سوالات کے لیے تیار ہوں تو بتائیں۔"
        else:
            reply = f"Understood{name_greeting}! Let me know whenever you're ready to begin the questions by saying 'Yes' or 'Let's start'."

        return {
            "reply": reply,
            "detected_language": detected_lang,
            "candidate_name": extracted_name,
            "proceed_to_questions": False,
            "next_dialogue_state": "ready_check",
        }
