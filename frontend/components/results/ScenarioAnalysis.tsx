interface ScenarioAnalysisProps {
  optionA_best_case: string;
  optionA_worst_case: string;
  optionB_best_case: string;
  optionB_worst_case: string;
  sensitivityLines: string[];
}

export function ScenarioAnalysis({
  optionA_best_case,
  optionA_worst_case,
  optionB_best_case,
  optionB_worst_case,
  sensitivityLines
}: ScenarioAnalysisProps) {
  return (
    <section id="scenarios" className="rounded-2xl border border-borderSubtle bg-surface p-6 shadow-panel sm:p-7">
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-inkMuted">Scenarios & sensitivity</h3>
      <p className="mt-2 text-sm text-inkMuted">
        Plausible bookends for each path, plus how the call might move if priorities shift.
      </p>

      {sensitivityLines.length > 0 ? (
        <ul className="mt-5 space-y-2 rounded-xl border border-optionB/15 bg-optionB-soft/50 p-4">
          {sensitivityLines.map((line, i) => (
            <li key={`${i}-${line.slice(0, 20)}`} className="flex gap-2 text-sm leading-relaxed text-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-optionB" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6 space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-optionA">Option A — outcomes</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-900/80">Best case</p>
              <p className="text-[11px] font-medium text-emerald-900/70">If things go well…</p>
              <p className="mt-2 text-sm leading-relaxed text-emerald-950">{optionA_best_case}</p>
            </div>
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-950/80">Worst case</p>
              <p className="text-[11px] font-medium text-amber-950/75">If things go poorly…</p>
              <p className="mt-2 text-sm leading-relaxed text-amber-950">{optionA_worst_case}</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-optionB">Option B — outcomes</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-900/80">Best case</p>
              <p className="text-[11px] font-medium text-emerald-900/70">If things go well…</p>
              <p className="mt-2 text-sm leading-relaxed text-emerald-950">{optionB_best_case}</p>
            </div>
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-950/80">Worst case</p>
              <p className="text-[11px] font-medium text-amber-950/75">If things go poorly…</p>
              <p className="mt-2 text-sm leading-relaxed text-amber-950">{optionB_worst_case}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
