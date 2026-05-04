import { ReactNode } from "react";

interface CollapsibleSectionProps {
  id: string;
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CollapsibleSection({
  id,
  title,
  description,
  defaultOpen = false,
  children
}: CollapsibleSectionProps) {
  return (
    <section id={id} className="panel overflow-hidden">
      <details open={defaultOpen} className="group">
        <summary className="cursor-pointer list-none px-5 py-4 marker:content-none [&::-webkit-details-marker]:hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-inkMuted">{title}</h3>
              {description ? <p className="mt-1 text-sm text-inkMuted">{description}</p> : null}
            </div>
            <span className="mt-0.5 shrink-0 text-xs font-semibold uppercase tracking-wide text-inkMuted group-open:hidden">
              Expand
            </span>
            <span className="mt-0.5 hidden shrink-0 text-xs font-semibold uppercase tracking-wide text-inkMuted group-open:inline">
              Collapse
            </span>
          </div>
        </summary>
        <div className="border-t border-borderSubtle bg-surfaceMuted/40 px-5 py-5">{children}</div>
      </details>
    </section>
  );
}

