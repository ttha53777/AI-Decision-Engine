from typing import Literal

from pydantic import BaseModel, Field


class DecisionRequest(BaseModel):
    decision: str = Field(..., min_length=3)
    optionA: str = Field(..., min_length=1)
    optionB: str = Field(..., min_length=1)
    priorities: list[str] = Field(default_factory=list)


class AgentAnalysis(BaseModel):
    agent: Literal["cost", "growth", "risk", "goal_alignment"]
    analysis: str
    scoreA: int = Field(..., ge=0, le=10)
    scoreB: int = Field(..., ge=0, le=10)


class Recommendation(BaseModel):
    recommendation: Literal["Option A", "Option B", "insufficient_information"]
    reason: str
    confidence: Literal["low", "medium", "high"]
    next_steps: list[str] = Field(default_factory=list)


class ScoreSummary(BaseModel):
    optionA_total: float
    optionB_total: float


class ScoreBreakdownItem(BaseModel):
    weight: float
    impact: float


class ScoreBreakdown(BaseModel):
    cost: ScoreBreakdownItem
    growth: ScoreBreakdownItem
    risk: ScoreBreakdownItem
    goal_alignment: ScoreBreakdownItem


class ScenarioAnalysis(BaseModel):
    optionA_best_case: str
    optionA_worst_case: str
    optionB_best_case: str
    optionB_worst_case: str


class RecommendationWithScores(Recommendation):
    score_summary: ScoreSummary | None = None
    score_breakdown: ScoreBreakdown | None = None
    key_factors: list[str] = Field(default_factory=list, max_length=4)
    what_would_change: list[str] = Field(default_factory=list, max_length=3)
    scenario_analysis: ScenarioAnalysis | None = None
    confidence_reason: str | None = None


class DecisionResponse(BaseModel):
    recommendation: RecommendationWithScores
    agents: dict[str, AgentAnalysis] = Field(default_factory=dict)

