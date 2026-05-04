from app.schemas.decision import DecisionRequest

LOW_SIGNAL_TOKENS = {
    "idk",
    "i dont know",
    "i don't know",
    "whatever",
    "anything",
    "this thing",
    "something",
    "none",
    "na",
    "n/a",
}


def _normalized(text: str) -> str:
    return " ".join(text.strip().lower().split())


def _is_low_signal_text(text: str) -> bool:
    value = _normalized(text)
    if not value:
        return True
    if value in LOW_SIGNAL_TOKENS:
        return True
    return len(value) < 8


def _is_bad_priorities(priorities: list[str]) -> bool:
    if not priorities:
        return True
    meaningful = [_normalized(item) for item in priorities if _normalized(item)]
    if not meaningful:
        return True
    return all(token in LOW_SIGNAL_TOKENS for token in meaningful)


def insufficient_input_reason(payload: DecisionRequest) -> str | None:
    if _is_low_signal_text(payload.decision):
        return (
            "The decision description is too vague to evaluate tradeoffs. "
            "Please explain the context, constraints, and what success looks like."
        )
    if _is_low_signal_text(payload.optionA) or _is_low_signal_text(payload.optionB):
        return (
            "One or both options are unclear. "
            "Please describe each option concretely so the system can compare them."
        )
    if _is_bad_priorities(payload.priorities):
        return (
            "Priorities are missing or not meaningful. "
            "Please provide clear priorities such as money, growth, stability, or work-life balance."
        )
    return None
