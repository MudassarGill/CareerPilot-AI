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
    ) -> Dict[str, Any]:
        """
        Evaluates candidate answer against scoring rubric:
        - Keyword coverage (40%)
        - Technical depth & completeness (30%)
        - Clarity & structure (30%)
        """
        clean_text = answer_text.strip()
        word_count = len(clean_text.split())

        if word_count < 5:
            return {
                "score": 15.0,
                "feedback": "Answer was too brief. Elaborate with specific technical principles, concrete examples, and trade-offs.",
                "matched_keywords": [],
                "missing_keywords": question_dict.get("expected_keywords", [])[:5],
                "clarity_score": 20.0,
                "pacing_feedback": "Rushed response. Take time to structure your thoughts using the STAR or Problem-Solution pattern.",
            }

        # 1. Technical Keyword Match (0 - 40 points)
        expected_kws = question_dict.get("expected_keywords", [])
        matched = []
        missing = []
        lower_answer = clean_text.lower()

        for kw in expected_kws:
            if kw.lower() in lower_answer:
                matched.append(kw)
            else:
                missing.append(kw)

        keyword_ratio = len(matched) / len(expected_kws) if expected_kws else 0.7
        keyword_score = min(keyword_ratio * 40.0, 40.0)

        # 2. Depth & Detail (0 - 30 points)
        # Optimal depth: 40 - 150 words for conversational answers
        if word_count < 20:
            depth_score = 12.0
        elif word_count < 40:
            depth_score = 22.0
        elif word_count <= 250:
            depth_score = 30.0
        else:
            depth_score = 25.0  # slightly long-winded

        # 3. Clarity & Structure (0 - 30 points)
        # Checks for structured transitions (because, for example, however, first, therefore)
        structural_markers = ["because", "for example", "specifically", "however", "therefore", "firstly", "in order to", "result", "benefit"]
        structure_count = sum(1 for m in structural_markers if m in lower_answer)
        clarity_score = min(18.0 + (structure_count * 3.0), 30.0)

        total_score = round(keyword_score + depth_score + clarity_score, 1)
        total_score = max(min(total_score, 100.0), 10.0)

        # Pacing feedback based on duration
        if duration_sec > 0:
            words_per_minute = (word_count / duration_sec) * 60
            if words_per_minute > 180:
                pacing_feedback = "Your pacing was quite fast (~{:.0f} wpm). Aim for ~130-150 wpm for maximum clarity.".format(words_per_minute)
            elif words_per_minute < 70 and duration_sec > 45:
                pacing_feedback = "Pacing was somewhat slow. Practice speaking with steady momentum."
            else:
                pacing_feedback = "Excellent conversational pacing and rhythm."
        else:
            pacing_feedback = "Good response delivery."

        # Actionable feedback generation
        feedback_points = []
        if len(matched) >= 3:
            feedback_points.append(f"Strong grasp of core concepts ({', '.join(matched[:3])}).")
        if missing:
            feedback_points.append(f"Consider mentioning {', '.join(missing[:3])} to add technical depth.")
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
        }
