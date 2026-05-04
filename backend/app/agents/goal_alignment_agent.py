from app.agents.prompts import GOAL_ALIGNMENT_AGENT_PROMPT
from app.schemas.decision import AgentAnalysis, DecisionRequest
from app.services.openai_service import get_openai_service


def goal_alignment_agent(payload: DecisionRequest) -> AgentAnalysis:
    # Priority-fit specialist: checks explicit alignment with user goals.
    openai_service = get_openai_service()
    return openai_service.call_model(
        system_prompt=GOAL_ALIGNMENT_AGENT_PROMPT,
        input_payload=payload.model_dump(),
        output_model=AgentAnalysis,
    )

