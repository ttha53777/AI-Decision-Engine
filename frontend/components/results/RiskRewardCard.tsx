import type { RiskRewardView } from "@/lib/resultsViewModel";

interface RiskRewardCardProps {
  view: RiskRewardView;
}

function Cell({
  label,
  body,
  tone
}: {
  label: string;
  body: string;
  tone: "up" | "down";
}) {
  const box =
    tone === "up"
      ? "border-emerald-200/80 bg-emerald-50/40"
      : "border-slate-200 bg-surfaceMuted/60";
  return (
    <div className={`rounded-xl border p-4 ${box}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-inkMuted">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink">{body}</p>
    </div>
  );
}

export function RiskRewardCard({ view }: RiskRewardCardProps) {
  return (
    <section className="rounded-2xl border border-borderSubtle bg-surface p-6 shadow-panel sm:p-7">
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-inkMuted">Risk / reward</h3>
      <p className="mt-2 text-sm text-inkMuted">
        Short versus long horizon—grounded in rubric scores (same 0–10 scale as deep metrics) and scenario language.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Cell label="Short-term upside" body={view.shortTermUpside} tone="up" />
        <Cell label="Short-term stress" body={view.shortTermDownside} tone="down" />
        <Cell label="Long-term upside" body={view.longTermUpside} tone="up" />
        <Cell label="Long-term downside" body={view.longTermDownside} tone="down" />
      </div>
    </section>
  );
}
