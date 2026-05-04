def _contains_any(text: str, keywords: list[str]) -> bool:
    lowered = text.lower()
    return any(keyword in lowered for keyword in keywords)


def clamp_score(value: int) -> int:
    return max(1, min(10, value))

