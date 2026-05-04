from pydantic import BaseModel

from app.agents.prompts import JUDGE_AGENT_PROMPT
from app.schemas.decision import AgentAnalysis, RecommendationWithScores, ScenarioAnalysis
from app.services.openai_service import get_openai_service
from app.services.scoring import calculate_scoring, top_driver


class JudgeLLMOutput(BaseModel):
    recommendation: str
    reason: str
    confidence_reason: str
    key_factors: list[str]
    what_would_change: list[str]
    scenario_analysis: ScenarioAnalysis


def _normalize_items(items: list[str], minimum: int, maximum: int, fallback: str) -> list[str]:
    cleaned = [item.strip() for item in items if item and item.strip()]
    while len(cleaned) < minimum:
        cleaned.append(fallback)
    return cleaned[:maximum]


def _confidence_from_spread(spread: float) -> str:
    if spread >= 10:
        return "high"
    if spread >= 4:
        return "medium"
    return "low"


def judge_agent(
    option_a: str,
    option_b: str,
    priorities: list[str],
    agent_results: dict[str, AgentAnalysis],
) -> RecommendationWithScores:
    weights, score_summary, score_breakdown = calculate_scoring(priorities, agent_results)
    spread = abs(score_summary.optionA_total - score_summary.optionB_total)
    weighted_winner = (
        "Option A" if score_summary.optionA_total >= score_summary.optionB_total else "Option B"
    )

    openai_service = get_openai_service()
    judge_result = openai_service.call_model(
        system_prompt=JUDGE_AGENT_PROMPT,
        input_payload={
            "decision_context": {
                "optionA": option_a,
                "optionB": option_b,
                "priorities": priorities,
            },
            "agent_outputs": {key: value.model_dump() for key, value in agent_results.items()},
            "priority_weights": weights,
            "weighted_score_summary": score_summary.model_dump(),
            "score_breakdown": score_breakdown.model_dump(),
            "top_driver": top_driver(score_breakdown),
        },
        output_model=JudgeLLMOutput,
    )

    recommendation = judge_result.recommendation.strip()
    if recommendation not in {"Option A", "Option B"}:
        recommendation = weighted_winner

    # Keep scoring coherent even if model response recommendation drifts.
    if recommendation != weighted_winner and spread >= 2:
        recommendation = weighted_winner
    _, score_summary, score_breakdown = calculate_scoring(
        priorities, agent_results, winner=recommendation
    )

    return RecommendationWithScores(
        recommendation=recommendation,
        reason=judge_result.reason,
        confidence_reason=judge_result.confidence_reason,
        confidence=_confidence_from_spread(spread),
        score_summary=score_summary,
        score_breakdown=score_breakdown,
        key_factors=_normalize_items(
            judge_result.key_factors,
            minimum=1,
            maximum=4,
            fallback="The weighted score distribution strongly influences the recommendation.",
        ),
        what_would_change=_normalize_items(
            judge_result.what_would_change,
            minimum=2,
            maximum=3,
            fallback="A meaningful shift in weighted category performance could flip this decision.",
        ),
        scenario_analysis=judge_result.scenario_analysis,
    )

