from app.agents.prompts import RISK_AGENT_PROMPT
from app.schemas.decision import AgentAnalysis, DecisionRequest
from app.services.openai_service import get_openai_service


def risk_agent(payload: DecisionRequest) -> AgentAnalysis:
    # Risk specialist: uncertainty, downside, and stability profile.
    openai_service = get_openai_service()
    return openai_service.call_model(
        system_prompt=RISK_AGENT_PROMPT,
        input_payload=payload.model_dump(),
        output_model=AgentAnalysis,
    )

