const links = [
  { href: "#recommendation", label: "Recommendation" },
  { href: "#scores", label: "Weighted totals" },
  { href: "#priorities", label: "Priorities" },
  { href: "#scenarios", label: "Scenarios" },
  { href: "#metrics", label: "Deep metrics" }
] as const;

export function ResultsSectionNav() {
  return (
    <nav
      className="hidden scroll-mt-0 border-b border-borderSubtle bg-surface/85 py-3 backdrop-blur-sm lg:sticky lg:top-[4.75rem] lg:z-20 lg:flex lg:flex-wrap lg:items-center lg:gap-2"
      aria-label="Jump to result sections"
    >
      <p className="mr-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-inkMuted">Jump to</p>
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className="rounded-full border border-borderSubtle bg-surfaceMuted px-3 py-1 text-xs font-semibold text-inkMuted transition hover:border-brand/30 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
        >
          {l.label}
        </a>
      ))}
    </nav>
  );
}
