from collections.abc import Iterable

from app.schemas.decision import AgentAnalysis, ScoreBreakdown, ScoreBreakdownItem, ScoreSummary

DEFAULT_AGENT_WEIGHTS: dict[str, float] = {
    "cost": 1.0,
    "growth": 1.0,
    "risk": 1.0,
    "goal_alignment": 1.0,
}

PRIORITY_AGENT_MAP: dict[str, str] = {
    "money": "cost",
    "budget": "cost",
    "salary": "cost",
    "compensation": "cost",
    "cost": "cost",
    "savings": "cost",
    "growth": "growth",
    "career": "growth",
    "learning": "growth",
    "upskill": "growth",
    "promotion": "growth",
    "upside": "growth",
    "stability": "risk",
    "risk": "risk",
    "security": "risk",
    "certainty": "risk",
    "safe": "risk",
    "personal goals": "goal_alignment",
    "goals": "goal_alignment",
    "values": "goal_alignment",
    "fit": "goal_alignment",
    "alignment": "goal_alignment",
    "lifestyle": "goal_alignment",
}


def build_priority_weights(priorities: list[str]) -> dict[str, float]:
    weights = dict(DEFAULT_AGENT_WEIGHTS)
    normalized: list[str] = [item.strip().lower() for item in priorities if item.strip()]
    total_priorities = len(normalized)

    for index, priority in enumerate(normalized):
        mapped_agent = PRIORITY_AGENT_MAP.get(priority)
        if not mapped_agent:
            continue

        # Earlier priorities get a stronger increment than later priorities.
        position_bonus = 0.9 - (index * (0.5 / max(total_priorities, 1)))
        weights[mapped_agent] += max(position_bonus, 0.35)

    return weights


def _weighted_totals(
    weights: dict[str, float], agent_results: dict[str, AgentAnalysis]
) -> tuple[float, float]:
    option_a_total = 0.0
    option_b_total = 0.0
    for agent_name, weight in weights.items():
        result = agent_results[agent_name]
        option_a_total += result.scoreA * weight
        option_b_total += result.scoreB * weight
    return option_a_total, option_b_total


def _impact_for_winner(
    agent_name: str,
    winner: str,
    weights: dict[str, float],
    agent_results: dict[str, AgentAnalysis],
) -> float:
    result = agent_results[agent_name]
    raw_diff = result.scoreA - result.scoreB if winner == "Option A" else result.scoreB - result.scoreA
    return round(raw_diff * weights[agent_name], 2)


def calculate_scoring(
    priorities: list[str], agent_results: dict[str, AgentAnalysis], winner: str | None = None
) -> tuple[dict[str, float], ScoreSummary, ScoreBreakdown]:
    weights = build_priority_weights(priorities)
    option_a_total, option_b_total = _weighted_totals(weights, agent_results)

    inferred_winner = winner or ("Option A" if option_a_total >= option_b_total else "Option B")
    breakdown = ScoreBreakdown(
        cost=ScoreBreakdownItem(
            weight=round(weights["cost"], 2),
            impact=_impact_for_winner("cost", inferred_winner, weights, agent_results),
        ),
        growth=ScoreBreakdownItem(
            weight=round(weights["growth"], 2),
            impact=_impact_for_winner("growth", inferred_winner, weights, agent_results),
        ),
        risk=ScoreBreakdownItem(
            weight=round(weights["risk"], 2),
            impact=_impact_for_winner("risk", inferred_winner, weights, agent_results),
        ),
        goal_alignment=ScoreBreakdownItem(
            weight=round(weights["goal_alignment"], 2),
            impact=_impact_for_winner("goal_alignment", inferred_winner, weights, agent_results),
        ),
    )
    summary = ScoreSummary(optionA_total=round(option_a_total, 2), optionB_total=round(option_b_total, 2))
    return weights, summary, breakdown


def top_driver(score_breakdown: ScoreBreakdown) -> str:
    entries: Iterable[tuple[str, ScoreBreakdownItem]] = (
        ("cost", score_breakdown.cost),
        ("growth", score_breakdown.growth),
        ("risk", score_breakdown.risk),
        ("goal_alignment", score_breakdown.goal_alignment),
    )
    return max(entries, key=lambda item: abs(item[1].impact))[0]
