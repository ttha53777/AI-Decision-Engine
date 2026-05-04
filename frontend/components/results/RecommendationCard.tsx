import type { Confidence } from "@/lib/types";

export function confidenceBadgeClasses(confidence: Confidence) {
  if (confidence === "high") return "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200/80";
  if (confidence === "medium") return "bg-amber-50 text-amber-950 ring-1 ring-amber-200/80";
  return "bg-rose-50 text-rose-900 ring-1 ring-rose-200/80";
}

interface RecommendationCardProps {
  winnerLabel: "Option A" | "Option B";
  optionTitle: string;
  confidence: Confidence;
  strengthPercent: number;
  headlineSummary: string;
  supportingReason: string;
  confidenceReason?: string;
}

export function RecommendationCard({
  winnerLabel,
  optionTitle,
  confidence,
  strengthPercent,
  headlineSummary,
  supportingReason,
  confidenceReason
}: RecommendationCardProps) {
  const showDetails = supportingReason.length > 280;

  return (
    <article className="panel-elevated relative overflow-hidden">
      <div
        className={`h-1.5 w-full ${
          winnerLabel === "Option A"
            ? "bg-gradient-to-r from-optionA to-optionA-muted"
            : "bg-gradient-to-r from-optionB to-optionB-muted"
        }`}
      />
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-inkMuted">
            Recommendation
          </p>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${confidenceBadgeClasses(
              confidence
            )}`}
          >
            {confidence} confidence
          </span>
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-inkMuted">
          {winnerLabel}
        </p>
        <h2 className="mt-1 text-lg font-semibold leading-snug tracking-tight text-ink sm:text-xl">
          {optionTitle}
        </h2>

        <div className="mt-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-inkMuted">
                Model strength
              </p>
              <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-ink">
                {strengthPercent}
                <span className="text-lg font-semibold text-inkMuted">%</span>
              </p>
            </div>
            <p className="max-w-[14rem] text-right text-xs leading-relaxed text-inkMuted">
              Composite signal from your inputs—not a guarantee of outcomes.
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surfaceMuted">
            <div
              className={`h-full rounded-full transition-[width] duration-500 ${
                winnerLabel === "Option A" ? "bg-optionA" : "bg-optionB"
              }`}
              style={{ width: `${strengthPercent}%` }}
            />
          </div>
        </div>

        <p className="mt-6 text-base font-medium leading-relaxed text-ink">{headlineSummary}</p>

        {showDetails ? (
          <details className="group mt-4 rounded-xl border border-borderSubtle bg-surfaceMuted/60 p-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="underline-offset-2 group-open:no-underline">Full rationale</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-inkMuted">{supportingReason}</p>
          </details>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-inkMuted">{supportingReason}</p>
        )}

        {confidenceReason ? (
          <p className="mt-5 border-t border-borderSubtle pt-5 text-sm leading-relaxed text-inkMuted">
            <span className="font-semibold text-ink">Why this confidence: </span>
            {confidenceReason}
          </p>
        ) : null}
      </div>
    </article>
  );
}
