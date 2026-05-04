# AI Decision Engine MVP

Minimal full-stack MVP for comparing two options with structured AI agent analysis and a weighted final judge recommendation.

## Tech Stack

- Frontend: Next.js 14 + TypeScript + Tailwind CSS
- Backend: FastAPI + Pydantic
- No database
- No authentication

## Folder Structure

```text
Decision/
  backend/
    app/
      agents/
        cost_agent.py
        goal_alignment_agent.py
        growth_agent.py
        judge_agent.py
        risk_agent.py
        prompts.py
      routes/
        decision.py
      schemas/
        decision.py
      services/
        decision_service.py
        openai_service.py
      main.py
    .env.example
    requirements.txt
  frontend/
    app/
      globals.css
      layout.tsx
      page.tsx
    components/
      ResultCard.tsx
    lib/
      api.ts
      types.ts
    package.json
    tailwind.config.ts
    tsconfig.json
  README.md
```

## Run Backend

1. Go to backend:
   - `cd backend`
2. Create and activate virtual environment:
   - `python3 -m venv .venv`
   - `source .venv/bin/activate`
3. Install dependencies:
   - `pip install -r requirements.txt`
4. Configure environment:
   - `cp .env.example .env`
   - set `OPENAI_API_KEY` in `.env`
5. Start API server:
   - `uvicorn app.main:app --reload --port 8000`

Backend base URL: `http://localhost:8000`

## Run Frontend

1. Open a second terminal and go to frontend:
   - `cd frontend`
2. Install dependencies:
   - `npm install`
3. Start app:
   - `npm run dev`

Frontend URL: `http://localhost:3000`

Optional API URL override:
- Create `frontend/.env.local` with:
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`

## API Contract

### POST `/analyze-decision`

Request:

```json
{
  "decision": "Should I choose job A or job B?",
  "optionA": "Stay at current company for stability",
  "optionB": "Join a startup for growth",
  "priorities": ["money", "growth", "stability"]
}
```

Response:

```json
{
  "recommendation": {
    "recommendation": "Option B",
    "reason": "Option B wins on growth upside and goal-fit while Option A remains stronger on stability. Because growth is a named priority and the weighted totals are meaningfully higher, Option B is the better fit overall.",
    "confidence": "medium",
    "confidence_reason": "Scores are separated enough to make a clear recommendation, but there are still meaningful tradeoffs.",
    "score_summary": {
      "optionA_total": 25.5,
      "optionB_total": 29.0
    },
    "score_breakdown": {
      "cost": { "weight": 1.9, "impact": -1.9 },
      "growth": { "weight": 1.75, "impact": 7.0 },
      "risk": { "weight": 1.4, "impact": -2.8 },
      "goal_alignment": { "weight": 1.0, "impact": 2.0 }
    },
    "key_factors": [
      "Growth weighted heavily from user priorities",
      "Option B has stronger growth upside"
    ],
    "what_would_change": [
      "If guaranteed compensation became significantly higher in Option A",
      "If stability became the top priority"
    ],
    "scenario_analysis": {
      "optionA_best_case": "Steady progression with reliable income and strong work-life balance.",
      "optionA_worst_case": "Slower development and lower long-term upside.",
      "optionB_best_case": "High upside from accelerated growth and equity gains.",
      "optionB_worst_case": "Startup volatility creates financial and career instability."
    }
  },
  "agents": {
    "cost": {
      "agent": "cost",
      "analysis": "Cost agent favors Option A based on pricing cues and cost-related priorities.",
      "scoreA": 7,
      "scoreB": 5
    },
    "growth": {
      "agent": "growth",
      "analysis": "Growth agent highlights future upside and skill acceleration, leaning toward Option B.",
      "scoreA": 5,
      "scoreB": 8
    },
    "risk": {
      "agent": "risk",
      "analysis": "Risk agent compares downside exposure and reliability signals, preferring Option A.",
      "scoreA": 8,
      "scoreB": 6
    },
    "goal_alignment": {
      "agent": "goal_alignment",
      "analysis": "Goal alignment agent checked stated priorities against each option and leaned toward Option B.",
      "scoreA": 5,
      "scoreB": 7
    }
  }
}
```

## Evaluation Harness

The evaluation harness runs a curated set of decision cases to track recommendation quality over time.

### Run (mock mode, deterministic)

From repo root:

- `python backend/evals/run_evals.py --mode mock`

This writes a report to `backend/evals/reports/latest.json` and exits non-zero if accuracy drops below the threshold.

Options:
- `--min-accuracy 0.70`: configure pass/fail threshold
- `--exclude-insufficient`: exclude cases whose expected recommendation is `insufficient_information` from accuracy

### Run (live mode, OpenAI)

Make sure `backend/.env` has `OPENAI_API_KEY`, then:

- `python backend/evals/run_evals.py --mode live`

Note: live mode is slower/costs tokens; mock mode is intended for CI regression checks.
