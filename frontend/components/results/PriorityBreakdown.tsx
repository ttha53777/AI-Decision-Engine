import { dimensionLabel, type PriorityImpactRow } from "@/lib/resultsViewModel";
import { formatSigned } from "@/lib/chartData";

interface PriorityBreakdownProps {
  rows: PriorityImpactRow[];
}

function FavoredPill({ favored }: { favored: PriorityImpactRow["favored"] }) {
  if (favored === "Even") {
    return (
      <span className="rounded-full bg-surfaceMuted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-inkMuted">
        Even
      </span>
    );
  }
  const isA = favored === "Option A";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        isA ? "bg-optionA-soft text-optionA ring-1 ring-optionA/25" : "bg-optionB-soft text-optionB ring-1 ring-optionB/25"
      }`}
    >
      Favors {isA ? "A" : "B"}
    </span>
  );
}

export function PriorityBreakdown({ rows }: PriorityBreakdownProps) {
  if (rows.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-borderSubtle bg-surface p-6 text-sm text-inkMuted shadow-panel">
        Priority impact needs score breakdown data from the API for this response.
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-borderSubtle bg-surface p-6 shadow-panel sm:p-7">
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-inkMuted">Priority impact</h3>
      <p className="mt-2 text-sm text-inkMuted">
        Each row ties your stated priority to a model dimension and shows which option that dimension favored.
      </p>

      <div className="mt-5 space-y-4">
        {rows.map((row) => {
          const total = row.scoreA + row.scoreB || 1;
          const aShare = (row.scoreA / total) * 100;
          return (
            <div key={row.id} className="rounded-xl border border-borderSubtle bg-surfaceMuted/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink">{row.label}</p>
                <FavoredPill favored={row.favored} />
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-inkMuted">
                Mapped to {dimensionLabel(row.dimension)} · model impact {formatSigned(row.impact)} · weight{" "}
                {row.weight.toFixed(2)}
              </p>
              <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-surfaceMuted">
                <div className="bg-optionA" style={{ width: `${aShare}%` }} />
                <div className="bg-optionB" style={{ width: `${100 - aShare}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-[11px] tabular-nums text-inkMuted">
                <span>
                  A rubric: <span className="font-semibold text-optionA">{row.scoreA}</span>
                </span>
                <span>
                  B rubric: <span className="font-semibold text-optionB">{row.scoreB}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
