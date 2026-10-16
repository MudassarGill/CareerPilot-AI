"""
============================================================
CareerPilot AI — Career Twin Pydantic Schemas (Phase 7)
============================================================
Request and response models for Career Twin & Multi-Year Simulation.
============================================================
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any


class HorizonStage(BaseModel):
    year: int
    title: str
    salary_range: str
    base_salary: int
    equity_bonus: int
    promotion_probability: int  # 0 - 100%
    primary_milestone: str
    recommended_skills: List[str]
    market_demand: str


class WhatIfScenario(BaseModel):
    track_name: str
    track_desc: str
    year_5_role: str
    year_5_salary: str
    cumulative_5yr_earnings: str
    transition_difficulty: str  # "Moderate" | "Challenging" | "High ROI"
    key_advantage: str


class CareerTwinSimRequest(BaseModel):
    target_role: str = "Frontend Developer"
    region: str = "US Remote"  # "US Remote" | "US Tech Hubs" | "Europe / UK" | "Global Remote"
    ambition_level: str = "accelerated"  # "steady" | "accelerated" | "executive"
    years_experience: int = 2


class CareerTwinSimResponse(BaseModel):
    target_role: str
    region: str
    ambition_level: str
    current_market_worth: str
    projected_5yr_worth: str
    cumulative_5yr_earnings: str
    horizons: List[HorizonStage]
    salary_curve: List[Dict[str, Any]]
    what_if_scenarios: List[WhatIfScenario]
    optimal_pivot_skill: str
    simulated_at: str
