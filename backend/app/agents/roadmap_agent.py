"""
============================================================
CareerPilot AI — Learning Roadmap Agent (Phase 5)
============================================================
Generates personalized, milestone-driven learning roadmaps
based on the user's target career role and identified skill gaps.

Process:
    1. Inspect target role requirements and identified skill gaps.
    2. Organize learning journey into 4 strategic progressive milestones:
       - Milestone 1: Core Foundations & Language Mechanics
       - Milestone 2: Modern Frameworks & Production Architecture
       - Milestone 3: Real-World Portfolio Projects & System Design
       - Milestone 4: DevOps, Cloud Deployment & Interview Prep
    3. Attach estimated completion hours and curated free resources
       (official documentation, interactive tutorials, and guides).
============================================================
"""

from typing import List, Dict, Any, Optional

# Curated role-based templates with milestones and actionable steps
ROLE_ROADMAP_TEMPLATES = {
    "Frontend Developer": [
        {
            "milestone": "Milestone 1: Modern JavaScript & TypeScript Foundations",
            "title": "Master ES6+, Async/Await & Event Loop",
            "description": "Deep dive into closures, prototypal inheritance, promises, microtasks, and ES Modules.",
            "estimated_hours": 12,
            "resources": [
                {"title": "MDN JavaScript Guide", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript", "type": "docs", "is_free": True},
                {"title": "JavaScript.info Modern Tutorial", "url": "https://javascript.info/", "type": "tutorial", "is_free": True},
            ],
        },
        {
            "milestone": "Milestone 1: Modern JavaScript & TypeScript Foundations",
            "title": "Adopt Strict TypeScript & Type Modeling",
            "description": "Learn interfaces, generics, utility types, and strict type checking for robust web apps.",
            "estimated_hours": 14,
            "resources": [
                {"title": "TypeScript Official Handbook", "url": "https://www.typescriptlang.org/docs/handbook/intro.html", "type": "docs", "is_free": True},
                {"title": "Total TypeScript Fundamentals", "url": "https://www.totaltypescript.com/", "type": "tutorial", "is_free": True},
            ],
        },
        {
            "milestone": "Milestone 2: React 19 Ecosystem & State Management",
            "title": "Master React 19 Hooks, Suspense & Server Components",
            "description": "Build high-performance UIs using custom hooks, useTransition, useDeferredValue, and modern context.",
            "estimated_hours": 18,
            "resources": [
                {"title": "React.dev Official Documentation", "url": "https://react.dev", "type": "docs", "is_free": True},
                {"title": "Epic React Deep Dives", "url": "https://epicreact.dev/", "type": "course", "is_free": False},
            ],
        },
        {
            "milestone": "Milestone 2: React 19 Ecosystem & State Management",
            "title": "State Architecture with Zustand or Redux Toolkit",
            "description": "Implement predictable client state, caching strategies, and persistent local storage sync.",
            "estimated_hours": 10,
            "resources": [
                {"title": "Zustand GitHub Documentation", "url": "https://github.com/pmndrs/zustand", "type": "docs", "is_free": True},
                {"title": "TanStack Query Guides", "url": "https://tanstack.com/query/latest", "type": "docs", "is_free": True},
            ],
        },
        {
            "milestone": "Milestone 3: Real-World Portfolio Projects & System Design",
            "title": "Build a Real-Time Collaborative SaaS Dashboard",
            "description": "Construct a responsive dashboard featuring data grids, charts, dark mode, and optimistic UI updates.",
            "estimated_hours": 24,
            "resources": [
                {"title": "Tailwind CSS Documentation", "url": "https://tailwindcss.com/docs", "type": "docs", "is_free": True},
                {"title": "Web.dev Responsive UI Patterns", "url": "https://web.dev/patterns/web-vitals-patterns/", "type": "tutorial", "is_free": True},
            ],
        },
        {
            "milestone": "Milestone 4: DevOps, Cloud Deployment & Interview Prep",
            "title": "Automate CI/CD, Lighthouse 95+ Audit & Production Deploy",
            "description": "Configure GitHub Actions, run automated Vitest suites, optimize Core Web Vitals, and deploy to Vercel/Netlify.",
            "estimated_hours": 12,
            "resources": [
                {"title": "Vite Production Build Guide", "url": "https://vite.dev/guide/build.html", "type": "docs", "is_free": True},
                {"title": "Google Web Vitals Guide", "url": "https://web.dev/vitals/", "type": "tutorial", "is_free": True},
            ],
        },
    ],

    "Backend Developer": [
        {
            "milestone": "Milestone 1: Core Foundations & Language Mechanics",
            "title": "Async Python & Modern FastAPI Design Patterns",
            "description": "Understand coroutines, event loop, dependency injection, and Pydantic v2 data validation schemas.",
            "estimated_hours": 14,
            "resources": [
                {"title": "FastAPI Official Documentation", "url": "https://fastapi.tiangolo.com/", "type": "docs", "is_free": True},
                {"title": "Real Python Async IO Guide", "url": "https://realpython.com/async-io-python/", "type": "tutorial", "is_free": True},
            ],
        },
        {
            "milestone": "Milestone 2: Modern Frameworks & Production Architecture",
            "title": "PostgreSQL Optimization, Indexing & SQLAlchemy 2.0",
            "description": "Design relational models, manage Alembic migrations, optimize JOINs, and execute connection pooling.",
            "estimated_hours": 16,
            "resources": [
                {"title": "SQLAlchemy 2.0 Unified Tutorial", "url": "https://docs.sqlalchemy.org/en/20/tutorial/", "type": "docs", "is_free": True},
                {"title": "Use The Index, Luke (SQL Indexing Guide)", "url": "https://use-the-index-luke.com/", "type": "tutorial", "is_free": True},
            ],
        },
        {
            "milestone": "Milestone 2: Modern Frameworks & Production Architecture",
            "title": "Authentication, JWT Tokens & Role-Based Access Control",
            "description": "Implement bcrypt password hashing, stateless JWT sessions, refresh token rotation, and OAuth2 security scopes.",
            "estimated_hours": 12,
            "resources": [
                {"title": "OAuth 2.0 Simplified", "url": "https://aaronparecki.com/oauth-2-simplified/", "type": "docs", "is_free": True},
                {"title": "FastAPI Security & OAuth2", "url": "https://fastapi.tiangolo.com/tutorial/security/", "type": "tutorial", "is_free": True},
            ],
        },
        {
            "milestone": "Milestone 3: Real-World Portfolio Projects & System Design",
            "title": "Distributed Caching with Redis & Background Task Queues",
            "description": "Implement Redis key-value caching, Celery/Arq asynchronous worker jobs, and rate limiting middleware.",
            "estimated_hours": 18,
            "resources": [
                {"title": "Redis Developer Documentation", "url": "https://redis.io/docs/", "type": "docs", "is_free": True},
                {"title": "System Design Primer by Donne Martin", "url": "https://github.com/donnemartin/system-design-primer", "type": "tutorial", "is_free": True},
            ],
        },
        {
            "milestone": "Milestone 4: DevOps, Cloud Deployment & Interview Prep",
            "title": "Containerize Multi-Service Backend with Docker & AWS EC2",
            "description": "Build multi-stage Dockerfiles, Docker Compose production clusters, Nginx reverse proxy, and deploy to AWS.",
            "estimated_hours": 15,
            "resources": [
                {"title": "Docker Best Practices Guide", "url": "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/", "type": "docs", "is_free": True},
                {"title": "FastAPI in Containers (Docker)", "url": "https://fastapi.tiangolo.com/deployment/docker/", "type": "tutorial", "is_free": True},
            ],
        },
    ],

    "AI/ML Engineer": [
        {
            "milestone": "Milestone 1: Deep Learning Foundations",
            "title": "Master PyTorch & Tensor Manipulations",
            "description": "Train custom neural networks, loss functions, autograd backpropagation, and data loaders in PyTorch.",
            "estimated_hours": 16,
            "resources": [
                {"title": "PyTorch Official 60-Minute Blitz", "url": "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html", "type": "docs", "is_free": True},
                {"title": "DeepLearning.AI Deep Learning Specialization", "url": "https://www.deeplearning.ai/", "type": "course", "is_free": False},
            ],
        },
        {
            "milestone": "Milestone 2: NLP, Transformers & Hugging Face",
            "title": "Fine-Tuning Transformer Models & PEFT/LoRA",
            "description": "Learn Hugging Face tokenizers, attention mechanisms, LoRA parameter-efficient fine-tuning on domain data.",
            "estimated_hours": 20,
            "resources": [
                {"title": "Hugging Face NLP Course", "url": "https://huggingface.co/learn/nlp-course", "type": "course", "is_free": True},
                {"title": "Jay Alammar The Illustrated Transformer", "url": "https://jalammar.github.io/illustrated-transformer/", "type": "tutorial", "is_free": True},
            ],
        },
        {
            "milestone": "Milestone 3: Agentic AI, RAG & Vector Databases",
            "title": "Build Production RAG Pipelines with ChromaDB & LangGraph",
            "description": "Implement chunking strategies, dense embeddings, vector retrieval, reranking, and autonomous multi-agent state graphs.",
            "estimated_hours": 25,
            "resources": [
                {"title": "LangChain & LangGraph Conceptual Guide", "url": "https://langchain-ai.github.io/langgraph/", "type": "docs", "is_free": True},
                {"title": "ChromaDB Documentation", "url": "https://docs.trychroma.com/", "type": "docs", "is_free": True},
            ],
        },
        {
            "milestone": "Milestone 4: MLOps, Model Deployment & Production Serving",
            "title": "Deploy Scalable Inference APIs with FastAPI & Docker",
            "description": "Export models to ONNX/TensorRT, benchmark token latency, build GPU Docker images, and track experiments with MLflow.",
            "estimated_hours": 18,
            "resources": [
                {"title": "MLflow Production Tracking", "url": "https://mlflow.org/docs/latest/index.html", "type": "docs", "is_free": True},
                {"title": "Ollama / vLLM High-Throughput Serving", "url": "https://docs.vllm.ai/", "type": "docs", "is_free": True},
            ],
        },
    ],

    "Full Stack Developer": [
        {
            "milestone": "Milestone 1: Core Web Architecture",
            "title": "End-to-End TypeScript Modeling & Monorepo Structure",
            "description": "Configure unified TypeScript definitions shared between frontend React and backend API endpoints.",
            "estimated_hours": 12,
            "resources": [
                {"title": "TypeScript Handbook", "url": "https://www.typescriptlang.org/docs/", "type": "docs", "is_free": True},
            ],
        },
        {
            "milestone": "Milestone 2: Full-Stack Feature Engineering",
            "title": "Implement Resilient Client-Server State Sync",
            "description": "Build authenticated RESTful APIs with FastAPI, connect with React hooks, and handle error boundaries.",
            "estimated_hours": 16,
            "resources": [
                {"title": "Full Stack Open (University of Helsinki)", "url": "https://fullstackopen.com/en/", "type": "course", "is_free": True},
            ],
        },
        {
            "milestone": "Milestone 3: Database & Cloud Storage Integration",
            "title": "Relational Data Modeling with PostgreSQL & S3 Uploads",
            "description": "Handle large file uploads (PDF/Images), write optimized relational queries, and manage cloud assets.",
            "estimated_hours": 18,
            "resources": [
                {"title": "PostgreSQL Official Documentation", "url": "https://www.postgresql.org/docs/", "type": "docs", "is_free": True},
            ],
        },
        {
            "milestone": "Milestone 4: Production Deployment & Observability",
            "title": "Full-Stack Docker Compose Deployment & Health Monitoring",
            "description": "Deploy complete full-stack architecture with Nginx reverse proxy, automated SSL, and health probes.",
            "estimated_hours": 14,
            "resources": [
                {"title": "Docker Compose Multi-Container Guide", "url": "https://docs.docker.com/compose/", "type": "docs", "is_free": True},
            ],
        },
    ],

    "DevOps Engineer": [
        {
            "milestone": "Milestone 1: Systems & Automation",
            "title": "Linux Kernel Internals, Networking & Shell Automation",
            "description": "Master bash scripting, iptables, systemd service management, and SSH hardening.",
            "estimated_hours": 14,
            "resources": [{"title": "Linux Journey", "url": "https://linuxjourney.com/", "type": "tutorial", "is_free": True}],
        },
        {
            "milestone": "Milestone 2: Containerization & CI/CD",
            "title": "Docker Multi-Stage Builds & GitHub Actions Workflows",
            "description": "Construct minimal production images, automated linting, test execution, and container registry publishing.",
            "estimated_hours": 16,
            "resources": [{"title": "GitHub Actions Documentation", "url": "https://docs.github.com/en/actions", "type": "docs", "is_free": True}],
        },
        {
            "milestone": "Milestone 3: Cloud Infrastructure & Orchestration",
            "title": "Kubernetes Cluster Administration & Helm Deployments",
            "description": "Deploy Deployments, StatefulSets, Ingress Controllers, ConfigMaps, and cluster autoscaling.",
            "estimated_hours": 22,
            "resources": [{"title": "Kubernetes Official Tutorials", "url": "https://kubernetes.io/docs/tutorials/", "type": "docs", "is_free": True}],
        },
        {
            "milestone": "Milestone 4: Infrastructure as Code & Monitoring",
            "title": "Terraform Cloud Provisioning & Prometheus/Grafana Dashboards",
            "description": "Provision AWS infrastructure deterministically and configure metrics collection and alerting rules.",
            "estimated_hours": 18,
            "resources": [{"title": "HashiCorp Terraform Tutorials", "url": "https://developer.hashicorp.com/terraform/tutorials", "type": "tutorial", "is_free": True}],
        },
    ],

    "Data Analyst": [
        {
            "milestone": "Milestone 1: Relational Data & SQL Mastery",
            "title": "Advanced SQL: Window Functions, CTEs & Aggregations",
            "description": "Query complex data relationships, cohort retention, and analytical time-series trends.",
            "estimated_hours": 14,
            "resources": [{"title": "Mode Analytics SQL Tutorial", "url": "https://mode.com/sql-tutorial/", "type": "tutorial", "is_free": True}],
        },
        {
            "milestone": "Milestone 2: Python Data Analysis Ecosystem",
            "title": "Pandas, NumPy & Exploratory Data Analysis (EDA)",
            "description": "Clean messy datasets, handle missing values, reshape dataframes, and extract statistical distributions.",
            "estimated_hours": 18,
            "resources": [{"title": "Python Data Science Handbook", "url": "https://jakevdp.github.io/PythonDataScienceHandbook/", "type": "docs", "is_free": True}],
        },
        {
            "milestone": "Milestone 3: Data Visualization & Storytelling",
            "title": "Interactive Dashboards with Tableau / PowerBI / Plotly",
            "description": "Build executive KPI dashboards with actionable metrics, drill-downs, and presentation decks.",
            "estimated_hours": 16,
            "resources": [{"title": "Seaborn Tutorial", "url": "https://seaborn.pydata.org/tutorial.html", "type": "docs", "is_free": True}],
        },
        {
            "milestone": "Milestone 4: Business Insights & Portfolio Presentation",
            "title": "End-to-End Business Case Study & Executive Report",
            "description": "Publish a comprehensive GitHub data portfolio project evaluating real customer acquisition data.",
            "estimated_hours": 15,
            "resources": [{"title": "Kaggle Datasets & Notebooks", "url": "https://www.kaggle.com/", "type": "tutorial", "is_free": True}],
        },
    ],
}


class RoadmapAgent:
    """Generates personalized milestone-driven learning roadmaps."""

    async def generate(
        self,
        target_role: str,
        skill_gaps: Optional[List[str]] = None,
        preferences: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Generate a structured learning roadmap tailored to candidate's target role.

        Args:
            target_role: e.g. "Frontend Developer", "AI/ML Engineer"
            skill_gaps: list of missing skills from skill gap analysis
            preferences: optional timeline or level preferences

        Returns:
            dict containing title, target_role, and ordered steps list
        """
        # Find closest match or fallback to Frontend Developer
        matched_role = "Frontend Developer"
        for role_key in ROLE_ROADMAP_TEMPLATES.keys():
            if role_key.lower() in target_role.lower() or target_role.lower() in role_key.lower():
                matched_role = role_key
                break

        base_steps = ROLE_ROADMAP_TEMPLATES.get(matched_role, ROLE_ROADMAP_TEMPLATES["Frontend Developer"])
        
        # Build prioritized step items
        result_steps = []
        gaps_set = set(g.lower() for g in (skill_gaps or []))

        for idx, item in enumerate(base_steps):
            # Check if this step directly bridges a missing skill gap
            is_priority = any(gap in item["title"].lower() or gap in item["description"].lower() for gap in gaps_set)
            
            step_dict = {
                "position": idx + 1,
                "milestone_name": item["milestone"],
                "title": item["title"],
                "description": item["description"],
                "estimated_hours": item["estimated_hours"],
                "resources": item.get("resources", []),
                "status": "pending",
                "is_priority_gap": is_priority,
            }
            result_steps.append(step_dict)

        title = f"Path to {matched_role} Mastery"

        return {
            "title": title,
            "target_role": matched_role,
            "total_steps": len(result_steps),
            "steps": result_steps,
        }
