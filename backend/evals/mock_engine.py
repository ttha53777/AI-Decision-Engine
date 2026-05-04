from __future__ import annotations

from dataclasses import dataclass

from app.schemas.decision import (
    AgentAnalysis,
    DecisionRequest,
    DecisionResponse,
    RecommendationWithScores,
    ScenarioAnalysis,
)
from app.services.input_quality import insufficient_input_reason
from app.services.scoring import calculate_scoring, top_driver


def _clamp_score(value: int) -> int:
    return max(0, min(10, value))


def _contains_any(text: str, keywords: list[str]) -> bool:
    lowered = text.lower()
    return any(keyword in lowered for keyword in keywords)


def _tokenize_priorities(priorities: list[str]) -> set[str]:
    tokens: set[str] = set()
    for p in priorities:
        t = p.strip().lower()
        if t:
            tokens.add(t)
    return tokens


@dataclass(frozen=True)
class MockAgentConfig:
    agent: str
    pos_keywords: list[str]
    neg_keywords: list[str]


AGENT_CONFIGS: dict[str, MockAgentConfig] = {
    "cost": MockAgentConfig(
        agent="cost",
        pos_keywords=[
            "cheap",
            "lower cost",
            "affordable",
            "save",
            "benefits",
            "high base",
            "higher salary",
            "lower living costs",
        ],
        neg_keywords=[
            "expensive",
            "debt",
            "uncertain income",
            "low cash",
            "low base",
            "tuition",
            "closing costs",
        ],
    ),
    "growth": MockAgentConfig(
        agent="growth",
        pos_keywords=[
            "learn",
            "learning",
            "growth",
            "mentorship",
            "fast",
            "lead",
            "responsibility",
            "upside",
            "equity",
        ],
        neg_keywords=["slow growth", "stagnant", "routine", "narrow", "limited"],
    ),
    "risk": MockAgentConfig(
        agent="risk",
        pos_keywords=[
            "stable",
            "predictable",
            "secure",
            "proven",
            "runway",
            "funded",
            "low variance",
        ],
        neg_keywords=["uncertain", "volatile", "startup", "unfunded", "high variance"],
    ),
    "goal_alignment": MockAgentConfig(agent="goal_alignment", pos_keywords=[], neg_keywords=[]),
}


def _score_text_for_agent(agent_name: str, text: str, priorities: set[str]) -> int:
    config = AGENT_CONFIGS[agent_name]
    score = 5

    score += sum(1 for kw in config.pos_keywords if kw in text.lower())
    score -= sum(1 for kw in config.neg_keywords if kw in text.lower())

    # Small bonus if the agent is explicitly prioritized.
    if agent_name == "cost" and priorities.intersection(
        {"money", "budget", "salary", "compensation", "cost", "savings"}
    ):
        score += 1
    if agent_name == "growth" and priorities.intersection(
        {"growth", "career", "learning", "upskill", "promotion", "upside"}
    ):
        score += 1
    if agent_name == "risk" and priorities.intersection(
        {"stability", "risk", "security", "certainty", "safe"}
    ):
        score += 1

    return _clamp_score(score)


def _goal_alignment_scores(payload: DecisionRequest) -> tuple[int, int, str]:
    priorities = [p.strip().lower() for p in payload.priorities if p.strip()]
    score_a = 5
    score_b = 5

    text_a = f"{payload.decision} {payload.optionA}".lower()
    text_b = f"{payload.decision} {payload.optionB}".lower()
    for p in priorities:
        if p in text_a:
            score_a += 1
        if p in text_b:
            score_b += 1

    score_a = _clamp_score(score_a)
    score_b = _clamp_score(score_b)
    favored = "Option A" if score_a >= score_b else "Option B"
    analysis = (
        "Alignment is estimated from explicit mentions of priorities; "
        f"{favored} matches more of the stated priorities."
    )
    return score_a, score_b, analysis


def _confidence_from_gap(gap: float) -> str:
    if gap >= 10:
        return "high"
    if gap >= 4:
        return "medium"
    return "low"


def analyze_decision_mock(payload: DecisionRequest) -> DecisionResponse:
    """
    Deterministic mock engine used for evaluation runs.
    It mimics the shape of the real pipeline without any network calls.
    """
    reason = insufficient_input_reason(payload)
    if reason:
        return DecisionResponse(
            recommendation=RecommendationWithScores(
                recommendation="insufficient_information",
                reason=reason,
                confidence="low",
                next_steps=[
                    "Clarify each option with concrete details and realistic outcomes.",
                    "Provide meaningful priorities (for example: money, growth, stability).",
                    "Add context like timeline, constraints, and what matters most right now.",
                ],
            ),
            agents={},
        )

    priorities_tokens = _tokenize_priorities(payload.priorities)
    text_a = f"{payload.decision} {payload.optionA}"
    text_b = f"{payload.decision} {payload.optionB}"

    cost_a = _score_text_for_agent("cost", text_a, priorities_tokens)
    cost_b = _score_text_for_agent("cost", text_b, priorities_tokens)
    growth_a = _score_text_for_agent("growth", text_a, priorities_tokens)
    growth_b = _score_text_for_agent("growth", text_b, priorities_tokens)
    risk_a = _score_text_for_agent("risk", text_a, priorities_tokens)
    risk_b = _score_text_for_agent("risk", text_b, priorities_tokens)
    ga_a, ga_b, ga_analysis = _goal_alignment_scores(payload)

    agents: dict[str, AgentAnalysis] = {
        "cost": AgentAnalysis(
            agent="cost",
            analysis="Mock cost analysis based on cost/compensation cues.",
            scoreA=cost_a,
            scoreB=cost_b,
        ),
        "growth": AgentAnalysis(
            agent="growth",
            analysis="Mock growth analysis based on learning/upside cues.",
            scoreA=growth_a,
            scoreB=growth_b,
        ),
        "risk": AgentAnalysis(
            agent="risk",
            analysis="Mock risk analysis based on stability/uncertainty cues.",
            scoreA=risk_a,
            scoreB=risk_b,
        ),
        "goal_alignment": AgentAnalysis(
            agent="goal_alignment",
            analysis=ga_analysis,
            scoreA=ga_a,
            scoreB=ga_b,
        ),
    }

    _, score_summary, score_breakdown = calculate_scoring(payload.priorities, agents)
    winner = (
        "Option A" if score_summary.optionA_total >= score_summary.optionB_total else "Option B"
    )
    gap = abs(score_summary.optionA_total - score_summary.optionB_total)
    driver = top_driver(score_breakdown)

    reason_text = (
        f"{winner} wins the weighted comparison. The strongest driver was '{driver}', "
        "based on deterministic keyword scoring in mock mode."
    )

    confidence_reason = (
        f"Confidence is based on the weighted score gap ({round(gap, 2)}). "
        "Mock mode is deterministic and intended for regression testing, not real-world truth."
    )

    recommendation = RecommendationWithScores(
        recommendation=winner,
        reason=reason_text,
        confidence=_confidence_from_gap(gap),
        next_steps=[],
        score_summary=score_summary,
        score_breakdown=score_breakdown,
        key_factors=[
            f"Top driver: {driver}",
            f"Weighted totals: A={score_summary.optionA_total}, B={score_summary.optionB_total}",
        ],
        what_would_change=[
            "If priorities change enough to re-weight the top driver, the recommendation may flip.",
            "If option details change to alter the mock keyword signals, scores may flip.",
        ],
        scenario_analysis=ScenarioAnalysis(
            optionA_best_case="Option A performs strongly on its highest-scoring categories.",
            optionA_worst_case="Option A underperforms on its lowest-scoring categories.",
            optionB_best_case="Option B performs strongly on its highest-scoring categories.",
            optionB_worst_case="Option B underperforms on its lowest-scoring categories.",
        ),
        confidence_reason=confidence_reason,
    )

    return DecisionResponse(recommendation=recommendation, agents=agents)

