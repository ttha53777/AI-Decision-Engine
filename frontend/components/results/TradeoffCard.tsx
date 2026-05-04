import type { TradeoffView } from "@/lib/resultsViewModel";

interface TradeoffCardProps {
  tradeoffs: TradeoffView;
}

export function TradeoffCard({ tradeoffs }: TradeoffCardProps) {
  return (
    <section className="rounded-2xl border border-borderSubtle bg-surfaceMuted/40 p-6 shadow-panel sm:p-7">
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-inkMuted">Key trade-offs</h3>
      <p className="mt-2 text-sm text-inkMuted">What you gain, give up, and accept on this path.</p>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-900/80">You gain</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-emerald-950">
            {tradeoffs.gains.map((g) => (
              <li key={g} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-surface p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-inkMuted">You give up</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink">
            {tradeoffs.givesUp.map((g) => (
              <li key={g} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 md:col-span-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-950/80">Risk you accept</p>
          <p className="mt-3 text-sm leading-relaxed text-amber-950">{tradeoffs.riskAccepted}</p>
        </div>
      </div>
    </section>
  );
}
