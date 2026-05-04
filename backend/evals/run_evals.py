from __future__ import annotations

import argparse
import json
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, ValidationError

# Allow running as `python evals/run_evals.py` from the backend directory.
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.schemas.decision import DecisionRequest, DecisionResponse  # noqa: E402


class EvalCase(BaseModel):
    id: str
    decision: str
    optionA: str
    optionB: str
    priorities: list[str]
    expected_recommendation: Literal["Option A", "Option B", "insufficient_information"]
    expected_top_driver: Literal["cost", "growth", "risk", "goal_alignment"] | None = None
    notes: str | None = None


@dataclass(frozen=True)
class CaseResult:
    case_id: str
    expected: str
    predicted: str
    ok: bool
    latency_ms: float
    insufficient: bool
    optionA_total: float | None
    optionB_total: float | None
    top_driver: str | None


def load_cases(path: Path) -> list[EvalCase]:
    cases: list[EvalCase] = []
    for line_num, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        raw = raw.strip()
        if not raw:
            continue
        try:
            cases.append(EvalCase.model_validate_json(raw))
        except ValidationError as error:
            raise RuntimeError(f"Invalid eval case at line {line_num}: {error}") from error
    if not cases:
        raise RuntimeError("No eval cases loaded.")
    return cases


def _extract_top_driver(response: DecisionResponse) -> str | None:
    breakdown = response.recommendation.score_breakdown
    if not breakdown:
        return None
    impacts = {
        "cost": breakdown.cost.impact,
        "growth": breakdown.growth.impact,
        "risk": breakdown.risk.impact,
        "goal_alignment": breakdown.goal_alignment.impact,
    }
    return max(impacts.items(), key=lambda item: abs(item[1]))[0]


def analyze_case(mode: str, case: EvalCase) -> DecisionResponse:
    payload = DecisionRequest(
        decision=case.decision,
        optionA=case.optionA,
        optionB=case.optionB,
        priorities=case.priorities,
    )

    if mode == "mock":
        from evals.mock_engine import analyze_decision_mock

        return analyze_decision_mock(payload)

    if mode == "live":
        from app.services.decision_service import analyze_decision

        return analyze_decision(payload)

    raise RuntimeError(f"Unknown mode: {mode}")


def run(mode: str, cases: list[EvalCase], exclude_insufficient: bool) -> tuple[list[dict], dict]:
    results: list[CaseResult] = []
    report_rows: list[dict] = []

    for case in cases:
        start = time.perf_counter()
        response = analyze_case(mode, case)
        elapsed_ms = (time.perf_counter() - start) * 1000.0

        predicted = response.recommendation.recommendation
        insufficient = predicted == "insufficient_information"
        expected = case.expected_recommendation

        ok = predicted == expected
        top_driver = _extract_top_driver(response)
        summary = response.recommendation.score_summary
        option_a_total = summary.optionA_total if summary else None
        option_b_total = summary.optionB_total if summary else None

        results.append(
            CaseResult(
                case_id=case.id,
                expected=expected,
                predicted=predicted,
                ok=ok,
                latency_ms=elapsed_ms,
                insufficient=insufficient,
                optionA_total=option_a_total,
                optionB_total=option_b_total,
                top_driver=top_driver,
            )
        )

        report_rows.append(
            {
                "id": case.id,
                "expected_recommendation": expected,
                "predicted_recommendation": predicted,
                "ok": ok,
                "latency_ms": round(elapsed_ms, 2),
                "insufficient": insufficient,
                "score_summary": response.recommendation.score_summary.model_dump()
                if response.recommendation.score_summary
                else None,
                "score_breakdown": response.recommendation.score_breakdown.model_dump()
                if response.recommendation.score_breakdown
                else None,
                "top_driver": top_driver,
                "expected_top_driver": case.expected_top_driver,
            }
        )

    eligible = [
        r
        for r in results
        if not (exclude_insufficient and (r.expected == "insufficient_information"))
    ]
    denom = max(len(eligible), 1)
    accuracy = sum(1 for r in eligible if r.ok) / denom

    confusion = {
        "Option A": {"Option A": 0, "Option B": 0, "insufficient_information": 0},
        "Option B": {"Option A": 0, "Option B": 0, "insufficient_information": 0},
        "insufficient_information": {"Option A": 0, "Option B": 0, "insufficient_information": 0},
    }
    for r in results:
        confusion[r.expected][r.predicted] += 1

    insufficient_rate = sum(1 for r in results if r.insufficient) / max(len(results), 1)
    avg_latency = sum(r.latency_ms for r in results) / max(len(results), 1)

    driver_cases = [c for c in cases if c.expected_top_driver]
    driver_matches = 0
    driver_denom = 0
    if driver_cases:
        expected_driver_by_id = {c.id: c.expected_top_driver for c in driver_cases}
        for r in results:
            exp = expected_driver_by_id.get(r.case_id)
            if exp is None or r.top_driver is None:
                continue
            driver_denom += 1
            if exp == r.top_driver:
                driver_matches += 1
    top_driver_match_rate = (driver_matches / driver_denom) if driver_denom else None

    summary = {
        "mode": mode,
        "total_cases": len(cases),
        "exclude_insufficient": exclude_insufficient,
        "accuracy": round(accuracy, 4),
        "insufficient_rate": round(insufficient_rate, 4),
        "avg_latency_ms": round(avg_latency, 2),
        "confusion": confusion,
        "top_driver_match_rate": round(top_driver_match_rate, 4)
        if top_driver_match_rate is not None
        else None,
    }
    return report_rows, summary


def main() -> int:
    parser = argparse.ArgumentParser(description="Run AI Decision Engine evaluations.")
    parser.add_argument("--mode", choices=["mock", "live"], default="mock")
    parser.add_argument(
        "--cases",
        default=str(Path(__file__).with_name("cases.jsonl")),
        help="Path to cases.jsonl",
    )
    parser.add_argument(
        "--min-accuracy",
        type=float,
        default=0.70,
        help="Exit non-zero if accuracy is below this threshold.",
    )
    parser.add_argument(
        "--exclude-insufficient",
        action="store_true",
        help="Exclude cases whose expected recommendation is insufficient_information from accuracy.",
    )

    args = parser.parse_args()

    cases_path = Path(args.cases)
    report_dir = Path(__file__).with_name("reports")
    report_dir.mkdir(parents=True, exist_ok=True)
    report_path = report_dir / "latest.json"

    cases = load_cases(cases_path)
    rows, summary = run(args.mode, cases, exclude_insufficient=args.exclude_insufficient)

    report = {"summary": summary, "results": rows}
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print("=== AI Decision Engine Eval Report ===")
    print(f"mode: {summary['mode']}")
    print(f"cases: {summary['total_cases']}")
    print(f"accuracy: {summary['accuracy']}")
    print(f"insufficient_rate: {summary['insufficient_rate']}")
    print(f"avg_latency_ms: {summary['avg_latency_ms']}")
    if summary["top_driver_match_rate"] is not None:
        print(f"top_driver_match_rate: {summary['top_driver_match_rate']}")
    print(f"report: {report_path}")

    if summary["accuracy"] < args.min_accuracy:
        print(f"FAIL: accuracy below threshold ({args.min_accuracy})", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

