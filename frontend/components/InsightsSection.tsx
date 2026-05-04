interface InsightsSectionProps {
  keyFactors: string[];
  whatWouldChange: string[];
}

export function InsightsSection({ keyFactors, whatWouldChange }: InsightsSectionProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="panel p-5 sm:p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-inkMuted">
          Key factors
        </h3>
        <p className="mt-1 text-sm text-inkMuted">What mattered most in the tradeoffs.</p>
        <ol className="mt-4 space-y-3">
          {keyFactors.map((factor, index) => (
            <li
              key={`${factor}-${index}`}
              className="flex gap-3 text-sm leading-relaxed text-ink"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surfaceMuted text-xs font-semibold text-inkMuted">
                {index + 1}
              </span>
              <span className="min-w-0 pt-0.5">{factor}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="panel p-5 sm:p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-inkMuted">
          What would change this
        </h3>
        <p className="mt-1 text-sm text-inkMuted">New information that could flip the call.</p>
        <ol className="mt-4 space-y-3">
          {whatWouldChange.map((condition, index) => (
            <li
              key={`${condition}-${index}`}
              className="flex gap-3 text-sm leading-relaxed text-ink"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surfaceMuted text-xs font-semibold text-inkMuted">
                {index + 1}
              </span>
              <span className="min-w-0 pt-0.5">{condition}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
