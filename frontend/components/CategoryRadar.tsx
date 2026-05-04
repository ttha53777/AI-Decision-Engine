import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";

import { buildRadarData } from "@/lib/chartData";
import { AgentResult } from "@/lib/types";

interface CategoryRadarProps {
  agents: Partial<{
    cost: AgentResult;
    growth: AgentResult;
    risk: AgentResult;
    goal_alignment: AgentResult;
  }>;
}

export function CategoryRadar({ agents }: CategoryRadarProps) {
  const data = buildRadarData(agents);

  return (
    <div className="h-72 w-full min-h-[18rem]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 16, right: 24, bottom: 8, left: 24 }}>
          <PolarGrid stroke="var(--color-border-subtle)" />
          <PolarAngleAxis dataKey="category" tick={{ fill: "#475569", fontSize: 12 }} />
          <Tooltip
            formatter={(value: number, name: string) => [`${Number(value).toFixed(1)}`, name]}
            labelFormatter={(label) => `${label}`}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              fontSize: 12,
              boxShadow: "0 1px 3px 0 rgb(15 23 42 / 0.08)"
            }}
            labelStyle={{ fontWeight: 600, color: "#0f172a" }}
            itemStyle={{ color: "#475569" }}
          />
          <Legend
            verticalAlign="bottom"
            height={28}
            formatter={(value) => <span className="text-xs text-inkMuted">{value}</span>}
          />
          <Radar
            name="Option A"
            dataKey="A"
            stroke="var(--color-option-a)"
            fill="var(--color-option-a)"
            fillOpacity={0.2}
          />
          <Radar
            name="Option B"
            dataKey="B"
            stroke="var(--color-option-b)"
            fill="var(--color-option-b)"
            fillOpacity={0.14}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

