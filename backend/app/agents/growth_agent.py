from app.agents.prompts import GROWTH_AGENT_PROMPT
from app.schemas.decision import AgentAnalysis, DecisionRequest
from app.services.openai_service import get_openai_service


def growth_agent(payload: DecisionRequest) -> AgentAnalysis:
    # Growth specialist: learning, upside, and long-term career trajectory.
    openai_service = get_openai_service()
    return openai_service.call_model(
        system_prompt=GROWTH_AGENT_PROMPT,
        input_payload=payload.model_dump(),
        output_model=AgentAnalysis,
    )

