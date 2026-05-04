import { confidenceBadgeClasses } from "@/components/results/RecommendationCard";
import type { Confidence } from "@/lib/types";

interface ExecutiveStripProps {
  winnerLabel: "Option A" | "Option B";
  confidence: Confidence;
  optionA_total: number;
  optionB_total: number;
}

export function ExecutiveStrip({
  winnerLabel,
  confidence,
  optionA_total,
  optionB_total
}: ExecutiveStripProps) {
  const diff = optionA_total - optionB_total;
  const margin = Math.abs(diff);
  const m = margin.toFixed(1);
  const ahead =
    diff === 0
      ? "Tie on weighted totals"
      : diff > 0
        ? `Option A ahead by ${m} pts`
        : `Option B ahead by ${m} pts`;

  const isA = winnerLabel === "Option A";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-borderSubtle bg-surface px-4 py-3 shadow-panel sm:px-5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-inkMuted">At a glance</span>
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          isA ? "bg-optionA-soft text-optionA ring-1 ring-optionA/25" : "bg-optionB-soft text-optionB ring-1 ring-optionB/25"
        }`}
      >
        Winner: {winnerLabel}
      </span>
      <span
        className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${confidenceBadgeClasses(confidence)}`}
      >
        {confidence} confidence
      </span>
      <span className="rounded-full bg-surfaceMuted px-3 py-1 text-xs font-medium text-ink">
        <span className="text-inkMuted">Margin: </span>
        {ahead}
      </span>
    </div>
  );
}
