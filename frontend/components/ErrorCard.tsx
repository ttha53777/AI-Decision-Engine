interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <section className="scroll-mt-28 rounded-2xl border border-red-200 bg-red-50/95 p-5 shadow-panelLg ring-1 ring-red-900/5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-red-700">
        Couldn’t analyze this decision
      </h2>
      <p className="mt-2 text-sm text-red-800">{message}</p>
      <p className="mt-3 text-xs text-red-700">
        If this keeps happening, confirm your backend is running and (optionally)
        check <span className="font-mono">NEXT_PUBLIC_API_BASE_URL</span>.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2"
          >
            Retry
          </button>
        ) : null}
      </div>
    </section>
  );
}

