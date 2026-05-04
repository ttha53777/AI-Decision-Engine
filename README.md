# AI Decision Engine

A structured AI decision-support tool that compares two options across four dimensions — **cost, growth, risk, and goal alignment** — then returns a weighted, explainable recommendation.

Most AI chatbots give vague answers when asked, “What should I do?” This project takes a more structured approach: it separates the decision into independent specialist agents, scores each option, applies user-defined priorities as weights, and produces a clear recommendation with confidence, tradeoffs, and scenario analysis.

---

## Overview

AI Decision Engine helps users make complex decisions by combining:

- Multi-agent analysis
- Priority-based weighting
- Structured scoring
- Explainable recommendations
- Confidence reasoning
- Scenario analysis
- Input-quality safeguards
- Evaluation testing

The goal is not just to give advice, but to make the reasoning behind that advice measurable and transparent.

---

## Why I Built This

High-stakes decisions are difficult because tradeoffs are often unclear. For example, when comparing two job offers, one option may have better salary while the other has stronger long-term growth. Most AI tools respond with generic pros and cons but avoid taking a clear stance.

This project was built to solve that problem by forcing the system to:

1. Analyze each option across separate decision dimensions.
2. Convert user priorities into actual scoring weights.
3. Produce a final recommendation with clear reasoning.
4. Explain what conditions would change the outcome.
5. Detect when the user has not provided enough information.

Instead of saying “it depends,” the engine gives a structured answer with a measurable recommendation.

---

## Example Use Cases

### Career Decisions

- Comparing two job offers
- Choosing between a startup and a larger company
- Deciding whether to accept a promotion
- Evaluating whether to switch roles or stay put

### Financial Decisions

- Renting vs buying
- Investing in a course or bootcamp
- Comparing financial tradeoffs between two options

### Personal Decisions

- Relocating to a new city
- Choosing between flexibility and stability
- Balancing commute, rent, and lifestyle

### Entrepreneurship

- Keeping a stable job vs starting a business
- Deciding whether to build runway before quitting
- Comparing safer vs higher-upside paths

---

## How It Works

The engine uses four specialist agents:

| Agent | Role |
|---|---|
| Cost Agent | Evaluates financial cost, affordability, and economic tradeoffs |
| Growth Agent | Evaluates learning potential, upside, and long-term opportunity |
| Risk Agent | Evaluates uncertainty, downside, and stability |
| Goal Alignment Agent | Evaluates how well each option matches the user's stated goals |

Each agent scores both options independently. The system then applies priority-based weights based on what the user cares about most.

A judge agent combines the weighted scores and specialist reasoning into one final recommendation.

---

## Core Features

- Compares two options using structured AI analysis
- Uses separate agents for cost, growth, risk, and goal alignment
- Converts user priorities into scoring weights
- Produces weighted totals for both options
- Returns a clear recommendation instead of vague advice
- Includes confidence level and confidence reasoning
- Shows key factors driving the decision
- Explains what would change the recommendation
- Provides best-case and worst-case scenario analysis
- Detects vague inputs and returns `insufficient_information`
- Includes an evaluation harness for regression testing

---

## Tech Stack

### Backend

- Python
- FastAPI
- LangChain
- OpenAI API
- Pydantic
- Uvicorn

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Testing / Evaluation

- JSONL evaluation cases
- Mock evaluation mode
- Live OpenAI evaluation mode
- Accuracy threshold checks
- Regression reports

---

## Getting Started

### Prerequisites

Make sure you have:

- Python 3.12+
- Node.js 18+
- An OpenAI API key

---

## Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Then add your OpenAI API key to `.env`:

```bash
OPENAI_API_KEY=your_api_key_here
```

Run the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

The backend runs at:

```txt
http://localhost:8000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```txt
http://localhost:3000
```

Optional: create `frontend/.env.local` to override the backend URL.

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## API Reference

### Analyze Decision

```txt
POST /analyze-decision
```

### Example Request

```json
{
  "decision": "Choosing between two job offers — optimize for long-term growth but care about stable income.",
  "optionA": "Large company: higher base, strong benefits, slower growth.",
  "optionB": "Startup: lower base, meaningful equity, faster learning, uncertain runway.",
  "priorities": ["growth", "money", "stability"]
}
```

### Example Response

```json
{
  "recommendation": {
    "recommendation": "Option B",
    "reason": "Option B wins on growth upside and goal fit. Growth is the top priority and the weighted total is meaningfully higher.",
    "confidence": "medium",
    "confidence_reason": "Scores are separated enough for a clear recommendation, but the tradeoffs remain meaningful.",
    "score_summary": {
      "optionA_total": 25.5,
      "optionB_total": 29.0
    },
    "score_breakdown": {
      "cost": {
        "weight": 1.65,
        "impact": -1.65
      },
      "growth": {
        "weight": 1.9,
        "impact": 7.6
      },
      "risk": {
        "weight": 1.4,
        "impact": -2.8
      },
      "goal_alignment": {
        "weight": 1.0,
        "impact": 2.0
      }
    },
    "key_factors": [
      "Growth was weighted heavily based on the user's priorities.",
      "Option B has stronger long-term learning and upside."
    ],
    "what_would_change": [
      "If stability became the top priority.",
      "If Option B's funding or runway became highly uncertain."
    ],
    "scenario_analysis": {
      "optionA_best_case": "Steady progression, reliable income, and strong work-life balance.",
      "optionA_worst_case": "Slower development and lower long-term upside.",
      "optionB_best_case": "High upside from accelerated growth and potential equity gains.",
      "optionB_worst_case": "Startup volatility creates financial and career instability."
    }
  },
  "agents": {
    "cost": {
      "agent": "cost",
      "analysis": "...",
      "scoreA": 7,
      "scoreB": 5
    },
    "growth": {
      "agent": "growth",
      "analysis": "...",
      "scoreA": 5,
      "scoreB": 8
    },
    "risk": {
      "agent": "risk",
      "analysis": "...",
      "scoreA": 8,
      "scoreB": 6
    },
    "goal_alignment": {
      "agent": "goal_alignment",
      "analysis": "...",
      "scoreA": 5,
      "scoreB": 7
    }
  }
}
```

---

## Input Quality Guard

If the user input is too vague, the engine does not run the full agent pipeline. Instead, it returns:

```json
{
  "recommendation": "insufficient_information",
  "next_steps": [
    "Clarify the two options.",
    "Add specific goals or priorities.",
    "Include relevant constraints such as money, time, risk, or timeline."
  ]
}
```

This prevents the system from producing confident recommendations based on weak input.

---

## Evaluation Harness

The project includes an evaluation harness with 30 curated decision cases covering:

- Job offers
- Career transitions
- Investment decisions
- Lifestyle tradeoffs
- Vague inputs that should trigger fallback behavior

The harness helps test whether changes to prompts, weighting logic, or schemas improve or degrade recommendation quality.

### Mock Mode

Mock mode is deterministic and fast, making it useful for CI or local regression checks.

```bash
python backend/evals/run_evals.py --mode mock
```

Writes a report to:

```txt
backend/evals/reports/latest.json
```

### Options

```bash
--min-accuracy 0.70
--exclude-insufficient
```

### Live Mode

Live mode uses real OpenAI calls.

```bash
python backend/evals/run_evals.py --mode live
```

This is useful for validating prompt changes, but it is slower and uses tokens.

---

## Key Design Decisions

### Why separate specialist agents?

A single prompt can sound thorough while still mixing together cost, risk, growth, and personal goals. Separating the agents makes each dimension more focused and easier to evaluate.

### Why use priority-based weighting?

User priorities should actually affect the outcome. If a user lists growth as their top priority, the growth score should matter more in the final recommendation.

### Why force a recommendation?

Most AI advice avoids taking a stance. This system is designed to recommend one option while still explaining confidence, tradeoffs, and what could change the outcome.

### Why include an eval harness?

Prompt changes can silently break behavior. The eval harness makes regressions visible by testing recommendations against expected outcomes and top drivers.

---

## Future Improvements

- Add support for comparing more than two options
- Add saved decision history
- Add user-adjustable weights in the frontend
- Add charts for score breakdowns
- Add authentication for persistent decision tracking
- Improve evaluation coverage with more edge cases

---

## Project Status

This project is actively being developed as a full-stack AI application focused on structured reasoning, explainability, and decision support.
