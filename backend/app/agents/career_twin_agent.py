"""
============================================================
CareerPilot AI — Career Twin Simulation Agent (Phase 7)
============================================================
Simulates multi-year career paths, compensation curves, promotion
probabilities, and 'What-If' scenarios across technical tracks.
============================================================
"""

from typing import Dict, Any, List
from datetime import datetime


ROLE_PROGRESSION_TEMPLATES = {
    "Frontend Developer": {
        "base_y0": 95000,
        "y1_role": "Senior Frontend Engineer",
        "y1_milestone": "Master Next.js 15, Server Components, and Web Performance Core Vitals.",
        "y1_skills": ["TypeScript Generics", "Next.js App Router", "State Machines"],
        "y3_role": "Staff Frontend Architect",
        "y3_milestone": "Lead design system federation, micro-frontend architecture, and telemetry.",
        "y3_skills": ["Micro-frontends", "CI/CD Automation", "Design Tokens"],
        "y5_role": "Principal UI Engineer / VP of Frontend",
        "y5_milestone": "Cross-organization technical governance, multi-region web resilience.",
        "y5_skills": ["Org-Wide Architecture", "Executive Roadmapping", "Vendor Optimization"],
        "optimal_pivot": "Next.js 15 & Server Components",
        "scenarios": [
            {
                "track_name": "Specialist UI Architecture",
                "track_desc": "Deep dive into web performance, rendering engines, and accessible design systems.",
                "year_5_role": "Principal Frontend Architect",
                "year_5_salary": "$215,000 - $250,000",
                "cumulative_5yr_earnings": "$920,000",
                "transition_difficulty": "Moderate",
                "key_advantage": "High industry demand for frontend scale & performance.",
            },
            {
                "track_name": "Full Stack & Distributed Pivot",
                "track_desc": "Broaden skill stack to backend async APIs, database indexing, and microservices.",
                "year_5_role": "Staff Full Stack Engineer",
                "year_5_salary": "$230,000 - $270,000",
                "cumulative_5yr_earnings": "$985,000",
                "transition_difficulty": "Challenging",
                "key_advantage": "Complete end-to-end autonomy and leadership capability.",
            },
            {
                "track_name": "AI Product Engineering Pivot",
                "track_desc": "Combine frontend mastery with generative AI embeddings, RAG, and prompt streaming.",
                "year_5_role": "Head of AI Product Experience",
                "year_5_salary": "$250,000 - $310,000",
                "cumulative_5yr_earnings": "$1,120,000",
                "transition_difficulty": "High ROI",
                "key_advantage": "Fastest growing compensation bracket across high-growth startups.",
            },
        ],
    },
    "Backend Developer": {
        "base_y0": 105000,
        "y1_role": "Senior Backend Systems Engineer",
        "y1_milestone": "Architect asynchronous microservices, database connection pooling, and Redis caching.",
        "y1_skills": ["Asyncio", "PostgreSQL Indexing", "Redis Pub/Sub"],
        "y3_role": "Distributed Systems Architect",
        "y3_milestone": "Lead event-driven Kafka messaging pipelines, Saga distributed transactions, and Docker orchestration.",
        "y3_skills": ["Apache Kafka", "Kubernetes", "gRPC / Protobuf"],
        "y5_role": "Principal Infrastructure Architect / VP of Eng",
        "y5_milestone": "Global multi-region cloud resilience, disaster recovery, and engineering governance.",
        "y5_skills": ["Multi-Cloud Architecture", "Zero Trust Security", "Executive Leadership"],
        "optimal_pivot": "Kafka Streaming & Distributed Transactions",
        "scenarios": [
            {
                "track_name": "Distributed Systems Specialist",
                "track_desc": "Specialize in event streaming, high-throughput pipelines, and low-latency databases.",
                "year_5_role": "Principal Distributed Systems Architect",
                "year_5_salary": "$235,000 - $285,000",
                "cumulative_5yr_earnings": "$1,050,000",
                "transition_difficulty": "Moderate",
                "key_advantage": "Unrivaled job security in core infrastructure.",
            },
            {
                "track_name": "Cloud DevOps & Platform Engineering",
                "track_desc": "Pivot towards Kubernetes cluster automation, Terraform IaC, and SRE leadership.",
                "year_5_role": "VP of Cloud Platform Operations",
                "year_5_salary": "$240,000 - $290,000",
                "cumulative_5yr_earnings": "$1,080,000",
                "transition_difficulty": "Moderate",
                "key_advantage": "High leverage across large engineering organizations.",
            },
            {
                "track_name": "AI Systems & MLOps Infrastructure",
                "track_desc": "Build scalable GPU cluster management, vector database infrastructure, and model inference pipelines.",
                "year_5_role": "Principal MLOps Infrastructure Architect",
                "year_5_salary": "$260,000 - $320,000",
                "cumulative_5yr_earnings": "$1,180,000",
                "transition_difficulty": "High ROI",
                "key_advantage": "Highest compensation multiplier in modern cloud computing.",
            },
        ],
    },
    "AI/ML Engineer": {
        "base_y0": 120000,
        "y1_role": "Senior AI / RAG Solutions Engineer",
        "y1_milestone": "Deploy enterprise semantic chunking, vector indexing, and hybrid search with rerankers.",
        "y1_skills": ["LangGraph", "ChromaDB / Pinecone", "PEFT & LoRA"],
        "y3_role": "Staff LLM & Generative AI Architect",
        "y3_milestone": "Fine-tune open-weights models, design self-correcting agent swarms, and implement automated evals.",
        "y3_skills": ["vLLM / TensorRT", "Ragas Evals", "Agentic Orchestration"],
        "y5_role": "Chief AI Officer / VP of Artificial Intelligence",
        "y5_milestone": "Executive enterprise AI strategy, ethical safety standards, and multi-modal autonomous systems.",
        "y5_skills": ["Executive AI Strategy", "Multi-Modal Foundations", "Patents & Research"],
        "optimal_pivot": "Fine-Tuning (LoRA) & Agentic LangGraph Workflows",
        "scenarios": [
            {
                "track_name": "Generative AI Systems Architect",
                "track_desc": "Design enterprise agentic workflows, autonomous multi-agent swarms, and RAG pipelines.",
                "year_5_role": "Principal AI Architect",
                "year_5_salary": "$270,000 - $340,000",
                "cumulative_5yr_earnings": "$1,250,000",
                "transition_difficulty": "Moderate",
                "key_advantage": "Core driving force behind modern corporate innovation.",
            },
            {
                "track_name": "MLOps & High-Throughput Inference",
                "track_desc": "Optimize model quantization (GGUF/AWQ), GPU cluster scaling, and latency SLAs.",
                "year_5_role": "Head of MLOps & Production AI",
                "year_5_salary": "$255,000 - $315,000",
                "cumulative_5yr_earnings": "$1,190,000",
                "transition_difficulty": "Challenging",
                "key_advantage": "Essential for operationalizing LLMs cost-effectively.",
            },
            {
                "track_name": "AI Product Founder / Chief AI Officer",
                "track_desc": "Executive leadership driving commercial product strategy powered by autonomous agents.",
                "year_5_role": "Chief AI Officer (CAIO)",
                "year_5_salary": "$300,000 - $420,000",
                "cumulative_5yr_earnings": "$1,450,000",
                "transition_difficulty": "High ROI",
                "key_advantage": "Maximum equity upside and organizational influence.",
            },
        ],
    },

    "Software Engineer": {
        "base_y0": 110000,
        "y1_role": "Senior Software Engineer",
        "y1_milestone": "Own end-to-end features, lead code reviews, and champion SOLID design patterns across services.",
        "y1_skills": ["System Design", "Design Patterns", "Advanced Data Structures"],
        "y3_role": "Staff Software Engineer / Tech Lead",
        "y3_milestone": "Drive cross-team technical strategy, architect distributed systems, and mentor engineering teams.",
        "y3_skills": ["Distributed Systems", "Technical Leadership", "Performance Engineering"],
        "y5_role": "Principal Engineer / Engineering Director",
        "y5_milestone": "Define organization-wide engineering standards, lead multi-year technical roadmaps, and influence company strategy.",
        "y5_skills": ["Architecture Governance", "Executive Communication", "Talent Development"],
        "optimal_pivot": "System Design & Distributed Architecture",
        "scenarios": [
            {
                "track_name": "Individual Contributor (IC) Track",
                "track_desc": "Remain a deep technical IC, solving the hardest engineering problems across the organization.",
                "year_5_role": "Principal Software Engineer",
                "year_5_salary": "$240,000 - $300,000",
                "cumulative_5yr_earnings": "$1,100,000",
                "transition_difficulty": "Moderate",
                "key_advantage": "Focus on code, architecture, and technical depth without people management.",
            },
            {
                "track_name": "Engineering Management Track",
                "track_desc": "Transition into engineering management, growing and leading high-performance engineering teams.",
                "year_5_role": "Director of Engineering",
                "year_5_salary": "$250,000 - $310,000",
                "cumulative_5yr_earnings": "$1,150,000",
                "transition_difficulty": "Moderate",
                "key_advantage": "Strong leadership progression with organizational impact.",
            },
            {
                "track_name": "AI-Augmented Engineering Lead",
                "track_desc": "Specialize in AI-powered development tools, copilot integrations, and autonomous code generation systems.",
                "year_5_role": "Head of AI-Augmented Engineering",
                "year_5_salary": "$275,000 - $350,000",
                "cumulative_5yr_earnings": "$1,280,000",
                "transition_difficulty": "High ROI",
                "key_advantage": "Fastest growing role combining SWE fundamentals with AI capabilities.",
            },
        ],
    },

    "Cloud Architect": {
        "base_y0": 130000,
        "y1_role": "Senior Cloud Solutions Architect",
        "y1_milestone": "Design multi-account AWS landing zones, implement IaC with Terraform, and achieve AWS Solutions Architect certification.",
        "y1_skills": ["Terraform Modules", "AWS Well-Architected", "Kubernetes"],
        "y3_role": "Principal Cloud Architect",
        "y3_milestone": "Lead enterprise cloud migration strategies, multi-cloud governance, and FinOps cost optimization programs.",
        "y3_skills": ["Multi-Cloud Strategy", "FinOps", "Zero Trust Architecture"],
        "y5_role": "VP of Cloud Infrastructure / CTO",
        "y5_milestone": "Executive cloud strategy, vendor negotiations, and global infrastructure resilience programs.",
        "y5_skills": ["Executive Strategy", "Vendor Management", "Compliance & Governance"],
        "optimal_pivot": "Multi-Cloud & Serverless Architecture",
        "scenarios": [
            {
                "track_name": "Enterprise Cloud Strategist",
                "track_desc": "Lead large-scale cloud transformation programs for Fortune 500 organizations.",
                "year_5_role": "VP of Cloud Architecture",
                "year_5_salary": "$260,000 - $320,000",
                "cumulative_5yr_earnings": "$1,200,000",
                "transition_difficulty": "Moderate",
                "key_advantage": "High demand in enterprise digital transformation.",
            },
            {
                "track_name": "Platform Engineering Lead",
                "track_desc": "Build internal developer platforms, golden paths, and self-service infrastructure portals.",
                "year_5_role": "Head of Platform Engineering",
                "year_5_salary": "$250,000 - $305,000",
                "cumulative_5yr_earnings": "$1,150,000",
                "transition_difficulty": "Moderate",
                "key_advantage": "Force multiplier for engineering productivity.",
            },
            {
                "track_name": "Cloud Security & Compliance",
                "track_desc": "Specialize in cloud-native security, FedRAMP compliance, and zero-trust architectures.",
                "year_5_role": "Chief Cloud Security Officer",
                "year_5_salary": "$270,000 - $340,000",
                "cumulative_5yr_earnings": "$1,250,000",
                "transition_difficulty": "High ROI",
                "key_advantage": "Critical demand driven by regulatory requirements.",
            },
        ],
    },

    "Cybersecurity Engineer": {
        "base_y0": 115000,
        "y1_role": "Senior Security Engineer",
        "y1_milestone": "Lead penetration testing engagements, implement SIEM correlation rules, and achieve CEH/OSCP certification.",
        "y1_skills": ["OSCP", "Splunk SIEM", "Cloud Security"],
        "y3_role": "Principal Security Architect",
        "y3_milestone": "Design zero-trust network architectures, lead security incident response teams, and manage SOC operations.",
        "y3_skills": ["Zero Trust", "Threat Modeling", "Security Operations"],
        "y5_role": "CISO / VP of Information Security",
        "y5_milestone": "Executive security strategy, regulatory compliance (SOC2/ISO/GDPR), and board-level risk communication.",
        "y5_skills": ["Executive Risk Management", "Compliance Governance", "Security Culture"],
        "optimal_pivot": "Offensive Security & Threat Intelligence",
        "scenarios": [
            {
                "track_name": "Offensive Security Specialist",
                "track_desc": "Specialize in red team operations, advanced persistent threat simulation, and bug bounty programs.",
                "year_5_role": "Head of Offensive Security",
                "year_5_salary": "$230,000 - $290,000",
                "cumulative_5yr_earnings": "$1,050,000",
                "transition_difficulty": "Moderate",
                "key_advantage": "Elite skillset with limited talent pool.",
            },
            {
                "track_name": "Security Architecture & GRC",
                "track_desc": "Lead governance, risk, and compliance programs across enterprise security frameworks.",
                "year_5_role": "VP of Security & Compliance",
                "year_5_salary": "$245,000 - $300,000",
                "cumulative_5yr_earnings": "$1,100,000",
                "transition_difficulty": "Moderate",
                "key_advantage": "Essential role in regulated industries (finance, healthcare).",
            },
            {
                "track_name": "CISO Executive Track",
                "track_desc": "Rise to Chief Information Security Officer with board-level security oversight responsibilities.",
                "year_5_role": "Chief Information Security Officer",
                "year_5_salary": "$280,000 - $380,000",
                "cumulative_5yr_earnings": "$1,350,000",
                "transition_difficulty": "High ROI",
                "key_advantage": "Top-tier executive compensation with critical organizational impact.",
            },
        ],
    },

    "Game Developer": {
        "base_y0": 90000,
        "y1_role": "Senior Game Programmer",
        "y1_milestone": "Ship a published title, master engine-level C++ programming, and implement physics/rendering systems.",
        "y1_skills": ["Unreal C++", "Shader Programming", "Physics Systems"],
        "y3_role": "Lead Game Engineer / Technical Director",
        "y3_milestone": "Lead game engine architecture, mentor teams, and optimize for cross-platform (PC/Console/Mobile) deployment.",
        "y3_skills": ["Engine Architecture", "Cross-Platform", "Team Leadership"],
        "y5_role": "Game Studio Technical Director / CTO",
        "y5_milestone": "Define studio-wide technical strategy, oversee multi-title pipelines, and manage live service operations.",
        "y5_skills": ["Studio Management", "Live Ops", "Technical Innovation"],
        "optimal_pivot": "Unreal Engine 5 & Real-Time Rendering",
        "scenarios": [
            {
                "track_name": "AAA Game Engine Specialist",
                "track_desc": "Deep specialization in rendering engines, real-time ray tracing, and performance optimization.",
                "year_5_role": "Principal Engine Programmer",
                "year_5_salary": "$200,000 - $260,000",
                "cumulative_5yr_earnings": "$900,000",
                "transition_difficulty": "Moderate",
                "key_advantage": "Rare expertise highly valued at major studios.",
            },
            {
                "track_name": "Indie Studio Founder",
                "track_desc": "Build and lead an independent game studio, shipping original IP titles.",
                "year_5_role": "Studio Founder / Creative Director",
                "year_5_salary": "$150,000 - $400,000+",
                "cumulative_5yr_earnings": "$800,000+",
                "transition_difficulty": "Challenging",
                "key_advantage": "Complete creative control and potential breakout success.",
            },
            {
                "track_name": "XR / Metaverse Engineering",
                "track_desc": "Pivot to VR/AR/XR development for gaming, simulation, and enterprise metaverse applications.",
                "year_5_role": "Head of XR Engineering",
                "year_5_salary": "$220,000 - $290,000",
                "cumulative_5yr_earnings": "$1,000,000",
                "transition_difficulty": "High ROI",
                "key_advantage": "Emerging market with explosive growth potential.",
            },
        ],
    },
}

# Fallback generic template for roles like Full Stack, DevOps, Data Analyst
DEFAULT_TEMPLATE = {
    "base_y0": 100000,
    "y1_role": "Senior Engineer",
    "y1_milestone": "Lead core architecture deliverables and mentor junior engineers.",
    "y1_skills": ["System Design", "Cloud Infrastructure", "CI/CD"],
    "y3_role": "Staff Engineer / Tech Lead",
    "y3_milestone": "Drive cross-team technical initiatives and organizational roadmaps.",
    "y3_skills": ["Architectural Governance", "Security Compliance", "Capacity Planning"],
    "y5_role": "Principal Engineer / VP of Technology",
    "y5_milestone": "Strategic organizational leadership and multi-million dollar cloud stewardship.",
    "y5_skills": ["Executive Roadmapping", "Vendor Negotiations", "Talent Development"],
    "optimal_pivot": "Distributed Systems & Cloud Architecture",
    "scenarios": [
        {
            "track_name": "Technical Specialist Track",
            "track_desc": "Remain focused on cutting-edge individual contributor engineering architecture.",
            "year_5_role": "Principal Engineer",
            "year_5_salary": "$220,000 - $265,000",
            "cumulative_5yr_earnings": "$960,000",
            "transition_difficulty": "Moderate",
            "key_advantage": "Focus purely on code, systems, and architecture without people management.",
        },
        {
            "track_name": "Engineering Management Track",
            "track_desc": "Transition into engineering management, team scaling, and department leadership.",
            "year_5_role": "Director of Engineering",
            "year_5_salary": "$235,000 - $280,000",
            "cumulative_5yr_earnings": "$1,040,000",
            "transition_difficulty": "Moderate",
            "key_advantage": "Strong leadership progression across mid-market and enterprise organizations.",
        },
        {
            "track_name": "Emerging Tech / AI Integration",
            "track_desc": "Specialize in integrating modern AI APIs and autonomous agent pipelines into legacy workflows.",
            "year_5_role": "Head of Technical Innovation",
            "year_5_salary": "$250,000 - $310,000",
            "cumulative_5yr_earnings": "$1,150,000",
            "transition_difficulty": "High ROI",
            "key_advantage": "High market premium for bridging traditional development with AI capabilities.",
        },
    ],
}


class CareerTwinAgent:
    """Simulates multi-year career paths, compensation curves, and promotion probabilities."""

    async def simulate(
        self,
        target_role: str = "Frontend Developer",
        region: str = "US Remote",
        ambition_level: str = "accelerated",
        years_experience: int = 2,
    ) -> Dict[str, Any]:
        """Run career trajectory simulation."""
        # Find matching template
        template = DEFAULT_TEMPLATE
        for key in ROLE_PROGRESSION_TEMPLATES.keys():
            if key.lower() in target_role.lower() or target_role.lower() in key.lower():
                template = ROLE_PROGRESSION_TEMPLATES[key]
                break

        # Regional multiplier
        reg_mult = 1.05
        if "hub" in region.lower() or "silicon" in region.lower() or "nyc" in region.lower():
            reg_mult = 1.25
        elif "europe" in region.lower() or "uk" in region.lower():
            reg_mult = 0.88
        elif "global" in region.lower():
            reg_mult = 0.78

        # Ambition multiplier
        amb_mult = 1.0
        promo_bonus = 0
        if ambition_level.lower() == "accelerated":
            amb_mult = 1.15
            promo_bonus = 8
        elif ambition_level.lower() == "executive":
            amb_mult = 1.28
            promo_bonus = 14

        # Experience baseline boost
        exp_boost = min(years_experience * 4500, 35000)
        base_y0 = int((template["base_y0"] + exp_boost) * reg_mult)

        # Calculate multi-year stages
        # Year 1
        y1_base = int(base_y0 * 1.18 * amb_mult)
        y1_bonus = int(y1_base * 0.12)
        # Year 3
        y3_base = int(base_y0 * 1.48 * amb_mult)
        y3_bonus = int(y3_base * 0.20)
        # Year 5
        y5_base = int(base_y0 * 1.95 * amb_mult)
        y5_bonus = int(y5_base * 0.30)

        horizons = [
            {
                "year": 1,
                "title": template["y1_role"],
                "salary_range": f"${y1_base - 10000:,} - ${y1_base + 15000:,}",
                "base_salary": y1_base,
                "equity_bonus": y1_bonus,
                "promotion_probability": min(76 + promo_bonus, 95),
                "primary_milestone": template["y1_milestone"],
                "recommended_skills": template["y1_skills"],
                "market_demand": "High Demand (Top 12% hiring velocity)",
            },
            {
                "year": 3,
                "title": template["y3_role"],
                "salary_range": f"${y3_base - 15000:,} - ${y3_base + 20000:,}",
                "base_salary": y3_base,
                "equity_bonus": y3_bonus,
                "promotion_probability": min(62 + promo_bonus, 88),
                "primary_milestone": template["y3_milestone"],
                "recommended_skills": template["y3_skills"],
                "market_demand": "Very High Demand (Staff / Architect tier)",
            },
            {
                "year": 5,
                "title": template["y5_role"],
                "salary_range": f"${y5_base - 20000:,} - ${y5_base + 35000:,}",
                "base_salary": y5_base,
                "equity_bonus": y5_bonus,
                "promotion_probability": min(48 + promo_bonus, 75),
                "primary_milestone": template["y5_milestone"],
                "recommended_skills": template["y5_skills"],
                "market_demand": "Executive Tier (Leadership stewardship)",
            },
        ]

        # Generate smooth salary curve (Year 0 through Year 5)
        salary_curve = []
        for yr in range(6):
            factor = 1.0 + (yr * 0.16 * amb_mult)
            b = int(base_y0 * factor)
            eq = int(b * (0.05 + (yr * 0.05)))
            salary_curve.append({
                "year_label": f"Year {yr}" if yr > 0 else "Current",
                "year": yr,
                "base_salary": b,
                "bonus_equity": eq,
                "total_comp": b + eq,
            })

        cum_earnings = sum(item["total_comp"] for item in salary_curve)

        return {
            "target_role": target_role,
            "region": region,
            "ambition_level": ambition_level.capitalize(),
            "current_market_worth": f"${base_y0:,}",
            "projected_5yr_worth": f"${y5_base + y5_bonus:,}",
            "cumulative_5yr_earnings": f"${cum_earnings:,}",
            "horizons": horizons,
            "salary_curve": salary_curve,
            "what_if_scenarios": template.get("scenarios", DEFAULT_TEMPLATE["scenarios"]),
            "optimal_pivot_skill": template.get("optimal_pivot", "System Architecture & AI APIs"),
            "simulated_at": datetime.utcnow().strftime("%B %d, %Y"),
        }
