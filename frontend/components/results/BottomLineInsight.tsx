interface BottomLineInsightProps {
  text: string;
}

export function BottomLineInsight({ text }: BottomLineInsightProps) {
  return (
    <aside className="rounded-2xl border border-slate-900/10 bg-slate-900 p-6 text-white shadow-[0_16px_48px_-12px_rgb(15_23_42/0.35)] sm:p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">Bottom line</p>
      <p className="mt-3 text-base font-medium leading-relaxed text-white sm:text-lg">{text}</p>
    </aside>
  );
}
