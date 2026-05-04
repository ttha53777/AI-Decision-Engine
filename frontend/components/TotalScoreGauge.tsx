import { formatSigned } from "@/lib/chartData";

interface TotalScoreGaugeProps {
  optionA_total: number;
  optionB_total: number;
  /** Omit outer card chrome when nested inside another panel */
  embedded?: boolean;
}

export function TotalScoreGauge({ optionA_total, optionB_total, embedded }: TotalScoreGaugeProps) {
  const combined = optionA_total + optionB_total;
  const aPct = combined > 0 ? (optionA_total / combined) * 100 : 50;
  const bPct = 100 - aPct;
  const winner = optionA_total >= optionB_total ? "Option A" : "Option B";
  const margin =
    optionA_total >= optionB_total ? optionA_total - optionB_total : optionB_total - optionA_total;
  const aColor = winner === "Option A" ? "bg-optionA" : "bg-slate-400";
  const bColor = winner === "Option B" ? "bg-optionB" : "bg-slate-400";

  const shell = embedded ? "rounded-xl bg-surfaceMuted/40 p-5 ring-1 ring-borderSubtle/80" : "panel p-5";

  return (
    <div className={shell}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-inkMuted">Total score</p>
          <p className="mt-2 text-lg font-semibold text-ink">
            {winner}{" "}
            <span className="text-sm font-medium text-inkMuted">({formatSigned(margin)})</span>
          </p>
        </div>
        <div className="text-right text-xs text-inkMuted">
          <div>
            <span className="font-semibold text-optionA">A</span>: {optionA_total}
          </div>
          <div>
            <span className="font-semibold text-optionB">B</span>: {optionB_total}
          </div>
        </div>
      </div>

      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-surfaceMuted">
        <div className="flex h-full">
          <div className={aColor} style={{ width: `${aPct}%` }} />
          <div className={bColor} style={{ width: `${bPct}%` }} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-inkMuted">
        <span>Option A share: {Math.round(aPct)}%</span>
        <span>Option B share: {Math.round(bPct)}%</span>
      </div>
    </div>
  );
}

