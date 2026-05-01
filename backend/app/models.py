"""Pydantic models for request/response schemas."""

from pydantic import BaseModel, Field
from typing import Optional


class DecisionRequest(BaseModel):
    """Input model for a decision analysis request."""

    question: str = Field(
        ...,
        description="The decision question to analyze",
        min_length=5,
        max_length=1000,
        json_schema_extra={"examples": ["Should I learn React or AI?"]}
    )
    context: Optional[str] = Field(
        default=None,
        description="Additional context about the user's situation",
        max_length=2000
    )
    priorities: Optional[list[str]] = Field(
        default=None,
        description="User's priorities (e.g., 'income', 'growth', 'stability')"
    )


class OptionAnalysis(BaseModel):
    """Analysis for a single decision option."""

    name: str
    score: float = Field(..., ge=0, le=100)
    pros: list[str]
    cons: list[str]
    risk_level: str = Field(..., description="low, medium, or high")
    timeline: str
    expected_outcome: str


class AlternativeScenario(BaseModel):
    """An alternative scenario the user may not have considered."""

    title: str
    description: str
    feasibility: str
    potential_impact: str


class DecisionResponse(BaseModel):
    """Full decision analysis response."""

    question: str
    best_choice: str
    best_choice_reasoning: str
    confidence: float = Field(..., ge=0, le=100)
    overall_risk: str
    options: list[OptionAnalysis]
    alternatives: list[AlternativeScenario]
    key_factors: list[str]
    recommendation_summary: str
    decision_framework: str
