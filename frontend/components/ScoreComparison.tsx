interface TotalsProps {
  optionA_total: number;
  optionB_total: number;
  className?: string;
}

/** Winner highlight cards only — totals bar lives in `TotalScoreGauge` / `VisualSummary`. */
export function ScoreHighlights({ optionA_total, optionB_total, className }: TotalsProps) {
  const winner = optionA_total >= optionB_total ? "Option A" : "Option B";

  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${className ?? ""}`}>
      <div
        className={`panel p-5 ${
          winner === "Option A"
            ? "border-optionA bg-optionA text-white shadow-md"
            : "border-borderSubtle bg-surface text-ink"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Option A</p>
        <p className="mt-2 text-2xl font-semibold">{optionA_total}</p>
        <p className="mt-1 text-xs uppercase tracking-wide opacity-80">
          {winner === "Option A" ? "Ahead on weighted total" : "Alternate path"}
        </p>
      </div>
      <div
        className={`panel p-5 ${
          winner === "Option B"
            ? "border-optionB bg-optionB text-white shadow-md"
            : "border-borderSubtle bg-surface text-ink"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Option B</p>
        <p className="mt-2 text-2xl font-semibold">{optionB_total}</p>
        <p className="mt-1 text-xs uppercase tracking-wide opacity-80">
          {winner === "Option B" ? "Ahead on weighted total" : "Alternate path"}
        </p>
      </div>
    </div>
  );
}

/** @deprecated Prefer `ScoreHighlights` with `VisualSummary` to avoid duplicate total bars. */
export function ScoreComparison({ optionA_total, optionB_total }: TotalsProps) {
  const combinedTotal = optionA_total + optionB_total;
  const optionAPercent =
    combinedTotal > 0 ? Math.round((optionA_total / combinedTotal) * 100) : 0;
  const optionBPercent = 100 - optionAPercent;
  const winner = optionA_total >= optionB_total ? "Option A" : "Option B";

  return (
    <>
      <div className="panel p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-inkMuted">
          Option score comparison
        </p>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-surfaceMuted">
          <div className="flex h-full">
            <div
              className={winner === "Option A" ? "bg-optionA" : "bg-slate-400"}
              style={{ width: `${optionAPercent}%` }}
            />
            <div
              className={winner === "Option B" ? "bg-optionB" : "bg-slate-400"}
              style={{ width: `${optionBPercent}%` }}
            />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-inkMuted">
          <span>Option A: {optionA_total}</span>
          <span>Option B: {optionB_total}</span>
        </div>
      </div>

      <ScoreHighlights optionA_total={optionA_total} optionB_total={optionB_total} />
    </>
  );
}
