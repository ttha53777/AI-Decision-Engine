"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { buildRadarData } from "@/lib/chartData";
import { AgentResult } from "@/lib/types";

interface CategoryGroupedBarsProps {
  agents: Partial<{
    cost: AgentResult;
    growth: AgentResult;
    risk: AgentResult;
    goal_alignment: AgentResult;
  }>;
}

function CategoryTooltip({
  active,
  payload,
  label
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-borderSubtle bg-surface px-3 py-2 text-xs shadow-panel">
      <p className="font-semibold text-ink">{label}</p>
      <ul className="mt-2 space-y-1">
        {payload.map((row) => (
          <li key={row.name} className="flex items-center justify-between gap-6 text-inkMuted">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: row.color }} />
              {row.name}
            </span>
            <span className="font-mono tabular-nums text-ink">{row.value?.toFixed(1)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CategoryGroupedBars({ agents }: CategoryGroupedBarsProps) {
  const data = buildRadarData(agents);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--color-border-subtle)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="category" tick={{ fill: "#475569", fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 10]} width={32} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip content={<CategoryTooltip />} cursor={{ fill: "rgb(148 163 184 / 0.08)" }} />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          formatter={(value) => <span className="text-inkMuted">{value}</span>}
        />
        <Bar dataKey="A" name="Option A" fill="var(--color-option-a)" radius={[4, 4, 0, 0]} maxBarSize={28} />
        <Bar dataKey="B" name="Option B" fill="var(--color-option-b)" radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
