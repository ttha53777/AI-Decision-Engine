export function AppHeader() {
  return (
    <header className="border-b border-borderSubtle bg-surface/90 shadow-panel backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-inkMuted">Product</p>
          <p className="mt-0.5 text-lg font-semibold tracking-tight text-ink">AI Decision Engine</p>
          <p className="mt-1 max-w-xl text-sm text-inkMuted">
            Compare two paths, weight what matters, and read a structured recommendation with scores.
          </p>
        </div>
        <nav className="flex flex-wrap gap-2 text-sm" aria-label="Page shortcuts">
          <a
            href="#analyze"
            className="focus-ring rounded-full border border-borderSubtle bg-surfaceMuted px-3 py-1.5 font-medium text-ink transition hover:bg-surface"
          >
            Analyze
          </a>
          <a
            href="#how-scoring"
            className="focus-ring rounded-full border border-borderSubtle bg-surfaceMuted px-3 py-1.5 font-medium text-ink transition hover:bg-surface"
          >
            How scoring works
          </a>
        </nav>
      </div>
    </header>
  );
}
