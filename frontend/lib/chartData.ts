import { AgentResult } from "@/lib/types";

export function formatSigned(value: number) {
  const rounded = Math.round(value * 100) / 100;
  if (rounded > 0) return `+${rounded}`;
  return `${rounded}`;
}

export function buildRadarData(agents: Partial<Record<string, AgentResult>>) {
  const cost = agents.cost;
  const growth = agents.growth;
  const risk = agents.risk;
  const goalAlignment = agents.goal_alignment;

  return [
    { category: "Cost", A: cost?.scoreA ?? 0, B: cost?.scoreB ?? 0 },
    { category: "Growth", A: growth?.scoreA ?? 0, B: growth?.scoreB ?? 0 },
    { category: "Risk", A: risk?.scoreA ?? 0, B: risk?.scoreB ?? 0 },
    { category: "Alignment", A: goalAlignment?.scoreA ?? 0, B: goalAlignment?.scoreB ?? 0 }
  ];
}

