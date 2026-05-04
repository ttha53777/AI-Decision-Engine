interface ScenarioGridProps {
  optionA_best_case: string;
  optionA_worst_case: string;
  optionB_best_case: string;
  optionB_worst_case: string;
}

function ScenarioCell({
  label,
  body,
  tone
}: {
  label: string;
  body: string;
  tone: "best" | "worst";
}) {
  const toneClass =
    tone === "best"
      ? "border-emerald-200/90 bg-emerald-50/80 ring-1 ring-emerald-100"
      : "border-amber-200/90 bg-amber-50/80 ring-1 ring-amber-100";

  return (
    <div className={`rounded-lg border px-3 py-3 sm:px-4 sm:py-4 ${toneClass}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-inkMuted">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink">{body}</p>
    </div>
  );
}

export function ScenarioGrid({
  optionA_best_case,
  optionA_worst_case,
  optionB_best_case,
  optionB_worst_case
}: ScenarioGridProps) {
  return (
    <section id="scenarios" className="panel p-5 sm:p-6">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-inkMuted">Scenarios</h3>
      <p className="mt-1 text-sm text-inkMuted">Best and worst plausible outcomes for each path.</p>

      <div className="mt-5 space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-optionA">Option A</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <ScenarioCell label="Best case" body={optionA_best_case} tone="best" />
            <ScenarioCell label="Worst case" body={optionA_worst_case} tone="worst" />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-optionB">Option B</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <ScenarioCell label="Best case" body={optionB_best_case} tone="best" />
            <ScenarioCell label="Worst case" body={optionB_worst_case} tone="worst" />
          </div>
        </div>
      </div>
    </section>
  );
}
