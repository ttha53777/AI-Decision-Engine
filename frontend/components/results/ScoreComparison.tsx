import { ScoreHighlights } from "@/components/ScoreComparison";
import { TotalScoreGauge } from "@/components/TotalScoreGauge";

interface ScoreComparisonProps {
  optionALabel: string;
  optionBLabel: string;
  optionA_total: number;
  optionB_total: number;
  winner: "Option A" | "Option B";
}

export function ScoreComparison({
  optionALabel,
  optionBLabel,
  optionA_total,
  optionB_total,
  winner
}: ScoreComparisonProps) {
  return (
    <section
      id="scores"
      className="scroll-mt-36 space-y-4 rounded-2xl border border-borderSubtle bg-surface p-6 shadow-panel sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-inkMuted">Weighted model totals</h3>
          <p className="mt-1 text-sm text-inkMuted">
            Single score per option after priority weights are applied to rubric dimensions (cost, growth, risk,
            alignment). Edge reflects this weighted total.
          </p>
        </div>
        <p className="rounded-full bg-surfaceMuted px-3 py-1 text-xs font-medium text-ink">
          Edge to <span className="font-semibold">{winner}</span>
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <TotalScoreGauge embedded optionA_total={optionA_total} optionB_total={optionB_total} />
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-inkMuted">Options you entered</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-optionA/20 bg-optionA-soft/40 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-optionA">Option A</p>
              <p className="mt-1 line-clamp-3 text-xs font-medium text-ink" title={optionALabel}>
                {optionALabel || "—"}
              </p>
            </div>
            <div className="rounded-xl border border-optionB/20 bg-optionB-soft/40 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-optionB">Option B</p>
              <p className="mt-1 line-clamp-3 text-xs font-medium text-ink" title={optionBLabel}>
                {optionBLabel || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ScoreHighlights optionA_total={optionA_total} optionB_total={optionB_total} />
    </section>
  );
}
