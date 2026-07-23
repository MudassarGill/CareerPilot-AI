"""
============================================================
CareerPilot AI — LangGraph Multi-Agent Definitions
============================================================
This package contains all AI agent definitions. Each agent
is a specialised LangGraph node with its own:

    - System prompt (defining the agent's role and expertise)
    - Tools (functions the agent can call)
    - Memory (conversation context)

Agents:
    - orchestrator.py      → Routes requests to the right agent
    - resume_agent.py      → Parses and analyses resumes
    - ats_agent.py         → Scores resumes against job descriptions
    - skill_gap_agent.py   → Identifies missing skills
    - roadmap_agent.py     → Generates learning roadmaps
    - interview_agent.py   → Conducts AI mock interviews
    - crs_agent.py         → Calculates Career Readiness Score
    - career_twin_agent.py → Simulates future career paths

Architecture:
    The Orchestrator receives user requests and delegates to
    specialist agents. Agents can also chain together (e.g.,
    Resume → Skill Gap → Roadmap) for multi-step workflows.
============================================================
"""
