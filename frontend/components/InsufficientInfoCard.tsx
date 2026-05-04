interface InsufficientInfoCardProps {
  reason: string;
  nextSteps: string[];
  onUseExample?: () => void;
}

export function InsufficientInfoCard({
  reason,
  nextSteps,
  onUseExample
}: InsufficientInfoCardProps) {
  return (
    <div className="scroll-mt-28 rounded-2xl border border-amber-300 bg-amber-50/95 p-6 shadow-panelLg ring-1 ring-amber-900/5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-700">
        Not Enough Information
      </h2>
      <p className="mt-3 text-lg font-semibold text-amber-900">
        More detail is needed before a reliable recommendation.
      </p>
      <p className="mt-2 text-sm text-amber-800">{reason}</p>
      <ul className="mt-4 space-y-2 text-sm text-amber-900">
        {nextSteps.map((step, index) => (
          <li key={`${step}-${index}`}>- {step}</li>
        ))}
      </ul>

      <div className="mt-5 rounded-lg border border-amber-200 bg-white/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
          Example (good input)
        </p>
        <p className="mt-2 text-sm text-amber-900">
          Decision: “Choosing between a large company offer and a startup offer.”
        </p>
        <p className="mt-1 text-sm text-amber-900">
          Priorities: growth, money, stability
        </p>
        {onUseExample ? (
          <button
            type="button"
            onClick={onUseExample}
            className="mt-4 rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2"
          >
            Use example
          </button>
        ) : null}
      </div>
    </div>
  );
}

