export type Confidence = "low" | "medium" | "high";

export interface DecisionRequest {
  decision: string;
  optionA: string;
  optionB: string;
  priorities: string[];
}

export interface AgentResult {
  agent: "cost" | "growth" | "risk" | "goal_alignment";
  analysis: string;
  scoreA: number;
  scoreB: number;
}

export interface DecisionResponse {
  recommendation: {
    recommendation: "Option A" | "Option B" | "insufficient_information";
    reason: string;
    confidence: Confidence;
    next_steps: string[];
    confidence_reason?: string;
    score_summary?: {
      optionA_total: number;
      optionB_total: number;
    };
    score_breakdown?: {
      cost: { weight: number; impact: number };
      growth: { weight: number; impact: number };
      risk: { weight: number; impact: number };
      goal_alignment: { weight: number; impact: number };
    };
    key_factors: string[];
    what_would_change: string[];
    scenario_analysis?: {
      optionA_best_case: string;
      optionA_worst_case: string;
      optionB_best_case: string;
      optionB_worst_case: string;
    };
  };
  agents: Partial<{
    cost: AgentResult;
    growth: AgentResult;
    risk: AgentResult;
    goal_alignment: AgentResult;
  }>;
}
