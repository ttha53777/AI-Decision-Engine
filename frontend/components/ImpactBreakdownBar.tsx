import { formatSigned } from "@/lib/chartData";

interface ImpactBreakdownBarProps {
  breakdown: {
    cost: { weight: number; impact: number };
    growth: { weight: number; impact: number };
    risk: { weight: number; impact: number };
    goal_alignment: { weight: number; impact: number };
  };
}

function topDriver(breakdown: ImpactBreakdownBarProps["breakdown"]) {
  const entries = Object.entries(breakdown) as Array<[keyof typeof breakdown, { impact: number }]>;
  return entries.sort((a, b) => Math.abs(b[1].impact) - Math.abs(a[1].impact))[0][0];
}

export function ImpactBreakdownBar({ breakdown }: ImpactBreakdownBarProps) {
  const driver = topDriver(breakdown);
  const items = [
    { key: "cost", label: "Cost", impact: breakdown.cost.impact },
    { key: "growth", label: "Growth", impact: breakdown.growth.impact },
    { key: "risk", label: "Risk", impact: breakdown.risk.impact },
    { key: "goal_alignment", label: "Alignment", impact: breakdown.goal_alignment.impact }
  ] as const;

  const total = items.reduce((sum, item) => sum + Math.abs(item.impact), 0) || 1;

  return (
    <div className="panel p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-inkMuted">
            Impact breakdown
          </p>
          <p className="mt-2 text-sm text-inkMuted">
            Biggest driver:{" "}
            <span className="font-semibold text-ink">
              {items.find((i) => i.key === driver)?.label}
            </span>
          </p>
        </div>
        <p className="max-w-xs text-xs text-inkMuted sm:text-right">
          Signed impacts show how each rubric dimension nudged the weighted total toward the winner.
        </p>
      </div>

      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-surfaceMuted">
        <div className="flex h-full w-full">
          {items.map((item) => {
            const width = (Math.abs(item.impact) / total) * 100;
            const isDriver = item.key === driver;
            return (
              <div
                key={item.key}
                className={isDriver ? "bg-brand" : "bg-slate-500"}
                style={{ width: `${width}%` }}
                aria-label={`${item.label} contribution ${formatSigned(item.impact)}`}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 text-xs text-inkMuted">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <span>{item.label}</span>
            <span className={item.key === driver ? "font-semibold text-ink" : ""}>
              {formatSigned(item.impact)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

