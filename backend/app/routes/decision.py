from fastapi import APIRouter, HTTPException

from app.schemas.decision import DecisionRequest, DecisionResponse
from app.services.decision_service import analyze_decision


router = APIRouter(tags=["decision"])


@router.post("/analyze-decision", response_model=DecisionResponse)
def analyze_decision_route(payload: DecisionRequest) -> DecisionResponse:
    try:
        return analyze_decision(payload)
    except RuntimeError as error:
        raise HTTPException(status_code=500, detail=str(error)) from error

