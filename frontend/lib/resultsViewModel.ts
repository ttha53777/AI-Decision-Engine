import type { AgentResult, Confidence, DecisionResponse } from "@/lib/types";

export type OptionId = "Option A" | "Option B";

type AgentKey = "cost" | "growth" | "risk" | "goal_alignment";

const DIMENSION_LABELS: Record<AgentKey, string> = {
  cost: "Cost & resources",
  growth: "Growth & upside",
  risk: "Risk & stability",
  goal_alignment: "Goal alignment"
};

function normalizePriority(p: string): string {
  return p.trim().toLowerCase();
}

function matchDimension(priority: string): AgentKey {
  const p = normalizePriority(priority);
  if (/(growth|career|learn|skill|promot|advance)/.test(p)) return "growth";
  if (/(money|salary|comp|cash|income|financial|cost|afford)/.test(p)) return "cost";
  if (/(risk|stable|stability|safe|security|stress|burnout|runway)/.test(p)) return "risk";
  if (/(align|value|mission|culture|purpose|fit|team|impact)/.test(p)) return "goal_alignment";
  return "growth";
}

function firstSentence(text: string): string {
  const t = text.trim();
  if (!t) return "";
  const cut = t.split(/(?<=[.!?])\s+/)[0];
  return cut.length > 220 ? `${cut.slice(0, 217)}…` : cut;
}

function lastSentence(text: string): string {
  const t = text.trim();
  if (!t) return "";
  const parts = t.split(/(?<=[.!?])\s+/).filter(Boolean);
  const last = parts[parts.length - 1] ?? t;
  return last.length > 240 ? `${last.slice(0, 237)}…` : last;
}

function favoredOption(scoreA: number, scoreB: number): OptionId | "Even" {
  if (Math.abs(scoreA - scoreB) < 0.5) return "Even";
  return scoreA > scoreB ? "Option A" : "Option B";
}

function confidenceStrength(confidence: "low" | "medium" | "high"): number {
  if (confidence === "high") return 88;
  if (confidence === "medium") return 72;
  return 54;
}

export interface PriorityImpactRow {
  id: string;
  label: string;
  dimension: AgentKey;
  favored: OptionId | "Even";
  scoreA: number;
  scoreB: number;
  weight: number;
  impact: number;
}

export interface TradeoffView {
  gains: string[];
  givesUp: string[];
  riskAccepted: string;
}

export interface RiskRewardView {
  shortTermUpside: string;
  shortTermDownside: string;
  longTermUpside: string;
  longTermDownside: string;
}

function pickAgent(agents: DecisionResponse["agents"], key: AgentKey): AgentResult | undefined {
  return agents[key];
}

export function buildTradeoffs(
  winner: OptionId,
  agents: DecisionResponse["agents"],
  keyFactors: string[],
  scenarioAnalysis: NonNullable<DecisionResponse["recommendation"]["scenario_analysis"]>
): TradeoffView {
  const dims: AgentKey[] = ["cost", "growth", "risk", "goal_alignment"];
  const winnerStrengths: string[] = [];
  const winnerWeaknesses: string[] = [];

  for (const d of dims) {
    const a = pickAgent(agents, d);
    if (!a) continue;
    const fav = favoredOption(a.scoreA, a.scoreB);
    const label = DIMENSION_LABELS[d];
    if (fav === winner) {
      winnerStrengths.push(`${label} favors your recommendation (${winner}).`);
    } else if (fav !== "Even") {
      winnerWeaknesses.push(`${label} leans toward ${fav === "Option A" ? "Option A" : "Option B"} instead.`);
    }
  }

  const gains =
    winnerStrengths.length > 0
      ? winnerStrengths.slice(0, 3)
      : keyFactors.slice(0, 2).map((k) => `Grounded in your priorities: ${k}`);

  const givesUp =
    winnerWeaknesses.length > 0
      ? winnerWeaknesses.slice(0, 3)
      : [
          "Some dimensions are close—neither path dominates everywhere.",
          "You may still be trading speed versus certainty depending on execution."
        ];

  const worst =
    winner === "Option A" ? scenarioAnalysis.optionA_worst_case : scenarioAnalysis.optionB_worst_case;
  const risk = pickAgent(agents, "risk");
  const riskSnippet = risk?.analysis ? risk.analysis.replace(/\s+/g, " ").trim().slice(0, 160) : "";
  const riskLens =
    riskSnippet && riskSnippet.length >= 160 ? `Risk lens: ${riskSnippet}…` : riskSnippet ? `Risk lens: ${riskSnippet}` : "";
  const riskAccepted = [worst ? `Stress case: ${worst}` : "", riskLens].filter(Boolean).join(" ").slice(0, 320);

  return {
    gains: gains.slice(0, 4),
    givesUp: givesUp.slice(0, 4),
    riskAccepted: riskAccepted || "Review the scenario stress cases on the right to pressure-test this call."
  };
}

export function buildRiskRewardView(
  winner: OptionId,
  agents: DecisionResponse["agents"],
  scenarioAnalysis: NonNullable<DecisionResponse["recommendation"]["scenario_analysis"]>
): RiskRewardView {
  const cost = pickAgent(agents, "cost");
  const growth = pickAgent(agents, "growth");
  const risk = pickAgent(agents, "risk");

  const aBest = scenarioAnalysis.optionA_best_case;
  const aWorst = scenarioAnalysis.optionA_worst_case;
  const bBest = scenarioAnalysis.optionB_best_case;
  const bWorst = scenarioAnalysis.optionB_worst_case;

  const shortUp =
    winner === "Option A"
      ? cost
        ? `Near-term economics lean on Option A (cost score ${cost.scoreA}/10 vs ${cost.scoreB}/10).`
        : aBest.slice(0, 140)
      : cost
        ? `Near-term economics lean on Option B (cost score ${cost.scoreB}/10 vs ${cost.scoreA}/10).`
        : bBest.slice(0, 140);

  const shortDown =
    winner === "Option A"
      ? aWorst.slice(0, 160)
      : bWorst.slice(0, 160);

  const longUp =
    growth
      ? `Longer arc: growth signal favors ${growth.scoreA >= growth.scoreB ? "Option A" : "Option B"} on the growth rubric (${growth.scoreA} vs ${growth.scoreB}).`
      : (winner === "Option A" ? aBest : bBest).slice(0, 160);

  const longDown =
    risk
      ? `Downside tail: risk rubric reads ${risk.scoreA}/10 vs ${risk.scoreB}/10 (higher is better on this scale).`
      : (winner === "Option A" ? aWorst : bWorst).slice(0, 160);

  return {
    shortTermUpside: shortUp,
    shortTermDownside: shortDown,
    longTermUpside: longUp,
    longTermDownside: longDown
  };
}

export function dimensionLabel(dim: AgentKey): string {
  return DIMENSION_LABELS[dim];
}

export function buildPriorityImpactRows(
  priorities: string[],
  agents: DecisionResponse["agents"],
  scoreBreakdown: NonNullable<DecisionResponse["recommendation"]["score_breakdown"]>
): PriorityImpactRow[] {
  const rows: PriorityImpactRow[] = [];

  if (priorities.length === 0) {
    (["cost", "growth", "risk", "goal_alignment"] as const).forEach((dim) => {
      const agent = pickAgent(agents, dim);
      rows.push({
        id: `dim-${dim}`,
        label: DIMENSION_LABELS[dim],
        dimension: dim,
        favored: agent ? favoredOption(agent.scoreA, agent.scoreB) : "Even",
        scoreA: agent?.scoreA ?? 0,
        scoreB: agent?.scoreB ?? 0,
        weight: scoreBreakdown[dim].weight,
        impact: scoreBreakdown[dim].impact
      });
    });
    return rows;
  }

  for (let i = 0; i < priorities.length; i++) {
    const label = priorities[i]!;
    const dim = matchDimension(label);
    const agent = pickAgent(agents, dim);
    const bd = scoreBreakdown[dim];
    const scoreA = agent?.scoreA ?? 5;
    const scoreB = agent?.scoreB ?? 5;
    const id = `${dim}-${i}-${label}`;
    rows.push({
      id,
      label,
      dimension: dim,
      favored: favoredOption(scoreA, scoreB),
      scoreA,
      scoreB,
      weight: bd?.weight ?? 0,
      impact: bd?.impact ?? 0
    });
    if (rows.length >= 5) break;
  }

  return rows.slice(0, 5);
}

export interface ResultsViewModel {
  winner: OptionId;
  winnerOptionTitle: string;
  confidenceLabel: Confidence;
  strengthPercent: number;
  headlineSummary: string;
  supportingReason: string;
  whyBullets: string[];
  tradeoffs: TradeoffView;
  bottomLine: string;
  priorityRows: PriorityImpactRow[];
  riskReward: RiskRewardView;
}

export function buildResultsViewModel(
  optionA: string,
  optionB: string,
  priorities: string[],
  result: DecisionResponse
): ResultsViewModel | null {
  const rec = result.recommendation.recommendation;
  if (rec === "insufficient_information") return null;

  const winner = rec as OptionId;
  const winnerOptionTitle = winner === "Option A" ? optionA || "Option A" : optionB || "Option B";
  const reason = result.recommendation.reason ?? "";
  const headlineSummary = firstSentence(reason);
  const supportingReason = reason;
  const whyBullets = (result.recommendation.key_factors ?? []).filter(Boolean).slice(0, 5);
  const scenario =
    result.recommendation.scenario_analysis ?? {
      optionA_best_case: "",
      optionA_worst_case: "",
      optionB_best_case: "",
      optionB_worst_case: ""
    };

  const tradeoffs = buildTradeoffs(winner, result.agents, whyBullets, scenario);
  const riskReward = buildRiskRewardView(winner, result.agents, scenario);

  const breakdown = result.recommendation.score_breakdown;
  const priorityRows = breakdown
    ? buildPriorityImpactRows(priorities, result.agents, breakdown)
    : [];

  const bottomLine =
    lastSentence(supportingReason) ||
    result.recommendation.confidence_reason ||
    `With ${result.recommendation.confidence} confidence, ${winner} is the stronger match to what you said matters.`;

  return {
    winner,
    winnerOptionTitle,
    confidenceLabel: result.recommendation.confidence,
    strengthPercent: confidenceStrength(result.recommendation.confidence),
    headlineSummary: headlineSummary || supportingReason.slice(0, 200),
    supportingReason,
    whyBullets:
      whyBullets.length > 0
        ? whyBullets
        : [
            "The weighted model favors this path on the dimensions you emphasized.",
            "Scores were closer in secondary areas—see the breakdown on the right."
          ],
    tradeoffs,
    bottomLine,
    priorityRows,
    riskReward
  };
}
