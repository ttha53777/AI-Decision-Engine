from app.agents.cost_agent import cost_agent
from app.agents.goal_alignment_agent import goal_alignment_agent
from app.agents.growth_agent import growth_agent
from app.agents.judge_agent import judge_agent
from app.agents.risk_agent import risk_agent
from app.schemas.decision import DecisionRequest, DecisionResponse, RecommendationWithScores
from app.services.input_quality import insufficient_input_reason


def analyze_decision(payload: DecisionRequest) -> DecisionResponse:
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
            )
        )

    agent_results = {
        "cost": cost_agent(payload),
        "growth": growth_agent(payload),
        "risk": risk_agent(payload),
        "goal_alignment": goal_alignment_agent(payload),
    }

    recommendation = judge_agent(
        payload.optionA, payload.optionB, payload.priorities, agent_results
    )

    return DecisionResponse(recommendation=recommendation, agents=agent_results)

