from pathlib import Path
import sys

# Allow running pytest from backend directory without installing as a package.
BACKEND_DIR = Path(__file__).resolve().parents[2]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from evals.run_evals import load_cases, run  # noqa: E402


def test_cases_load_and_validate() -> None:
    cases_path = Path(__file__).resolve().parents[1] / "cases.jsonl"
    cases = load_cases(cases_path)
    assert len(cases) >= 30
    assert all(case.id for case in cases)


def test_mock_runner_writes_expected_summary_keys(tmp_path: Path) -> None:
    cases_path = Path(__file__).resolve().parents[1] / "cases.jsonl"
    cases = load_cases(cases_path)[:5]

    rows, summary = run("mock", cases, exclude_insufficient=False)
    assert isinstance(rows, list)
    assert "accuracy" in summary
    assert "confusion" in summary
    assert summary["mode"] == "mock"


def test_mock_golden_case_001() -> None:
    cases_path = Path(__file__).resolve().parents[1] / "cases.jsonl"
    cases = load_cases(cases_path)
    target = next(case for case in cases if case.id == "case_001_job_stability_vs_startup")
    rows, summary = run("mock", [target], exclude_insufficient=False)
    assert summary["total_cases"] == 1
    assert rows[0]["predicted_recommendation"] in {"Option A", "Option B", "insufficient_information"}
