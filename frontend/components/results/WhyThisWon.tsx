interface WhyThisWonProps {
  bullets: string[];
  priorities: string[];
}

export function WhyThisWon({ bullets, priorities }: WhyThisWonProps) {
  const list = bullets.slice(0, 5);

  return (
    <section className="rounded-2xl border border-borderSubtle bg-surface p-6 shadow-panel sm:p-7">
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-inkMuted">Why this won</h3>
      <p className="mt-2 text-sm text-inkMuted">
        {priorities.length > 0 ? (
          <>
            Reasons tied to your stated priorities{" "}
            <span className="font-medium text-ink">({priorities.slice(0, 4).join(" · ")})</span>.
          </>
        ) : (
          "Reasons grounded in the model’s read of your decision and inputs."
        )}
      </p>
      <ul className="mt-5 space-y-3">
        {list.map((item, i) => (
          <li key={`${i}-${item.slice(0, 24)}`} className="flex gap-3 text-sm leading-relaxed text-ink">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-bold text-white">
              {i + 1}
            </span>
            <span className="min-w-0 pt-0.5">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
