interface ResultCardProps {
  title: string;
  analysis: string;
  scoreA: number;
  scoreB: number;
  weight?: number;
  impact?: number;
}

export function ResultCard({
  title,
  analysis,
  scoreA,
  scoreB,
  weight,
  impact
}: ResultCardProps) {
  const total = Math.max(scoreA + scoreB, 1);
  const scoreAPercent = Math.round((scoreA / total) * 100);
  const scoreBPercent = 100 - scoreAPercent;

  return (
    <div className="panel p-5 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-inkMuted">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-inkMuted">{analysis}</p>
      {typeof weight === "number" && typeof impact === "number" ? (
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-inkMuted">
          <span className="rounded-md bg-surfaceMuted px-2 py-1 font-medium text-ink">
            Weight: {weight.toFixed(2)}×
          </span>
          <span className="rounded-md bg-surfaceMuted px-2 py-1 font-medium text-ink">
            Impact: {impact.toFixed(2)}
          </span>
        </div>
      ) : null}
      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-surfaceMuted">
          <div className="flex h-full w-full">
            <div
              className="h-full bg-optionA"
              style={{ width: `${scoreAPercent}%` }}
              aria-label={`Option A score share ${scoreAPercent}%`}
            />
            <div
              className="h-full bg-optionB"
              style={{ width: `${scoreBPercent}%` }}
              aria-label={`Option B score share ${scoreBPercent}%`}
            />
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <span className="rounded-md bg-optionA/10 px-3 py-1 font-medium text-optionA">
          A: {scoreA}/10
        </span>
        <span className="rounded-md bg-optionB/10 px-3 py-1 font-medium text-optionB">
          B: {scoreB}/10
        </span>
      </div>
    </div>
  );
}
