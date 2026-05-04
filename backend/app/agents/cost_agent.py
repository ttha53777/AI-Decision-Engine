from app.agents.prompts import COST_AGENT_PROMPT
from app.schemas.decision import AgentAnalysis, DecisionRequest
from app.services.openai_service import get_openai_service


def cost_agent(payload: DecisionRequest) -> AgentAnalysis:
    # Financial specialist: short-term and long-term cost tradeoffs.
    openai_service = get_openai_service()
    return openai_service.call_model(
        system_prompt=COST_AGENT_PROMPT,
        input_payload=payload.model_dump(),
        output_model=AgentAnalysis,
    )

