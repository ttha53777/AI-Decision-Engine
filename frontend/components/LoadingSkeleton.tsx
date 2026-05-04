function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-surfaceMuted ${className}`} />;
}

export function LoadingSkeleton() {
  return (
    <section
      className="flex flex-col gap-6 rounded-2xl border border-borderSubtle bg-surface p-5 shadow-panelLg lg:grid lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-10"
      role="status"
      aria-live="polite"
      aria-label="Analyzing decision"
    >
      <div className="panel w-full max-lg:order-1 p-5 lg:order-none lg:col-span-2">
        <SkeletonBlock className="h-3 w-28" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <SkeletonBlock className="h-14 w-full" />
          <SkeletonBlock className="h-14 w-full" />
        </div>
      </div>

      <div className="panel max-lg:order-2 p-6 lg:order-none">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="mt-4 h-8 w-48" />
        <SkeletonBlock className="mt-4 h-3 w-full" />
        <SkeletonBlock className="mt-2 h-3 w-[92%]" />
        <SkeletonBlock className="mt-2 h-3 w-[78%]" />
      </div>

      <div className="panel max-lg:order-5 space-y-4 p-5 lg:order-none">
        <SkeletonBlock className="h-3 w-28" />
        <SkeletonBlock className="h-10 w-full" />
        <SkeletonBlock className="h-3 w-full" />
      </div>

      <div className="max-lg:order-4 grid gap-4 lg:order-none lg:grid-cols-2">
        <div className="panel p-5">
          <SkeletonBlock className="h-3 w-32" />
          <SkeletonBlock className="mt-4 h-3 w-full" />
          <SkeletonBlock className="mt-2 h-3 w-[88%]" />
          <SkeletonBlock className="mt-2 h-3 w-[72%]" />
        </div>
        <div className="panel p-5">
          <SkeletonBlock className="h-3 w-40" />
          <SkeletonBlock className="mt-4 h-3 w-full" />
          <SkeletonBlock className="mt-2 h-3 w-[84%]" />
          <SkeletonBlock className="mt-2 h-3 w-[70%]" />
        </div>
      </div>

      <div className="panel max-lg:order-6 p-5 lg:order-none">
        <SkeletonBlock className="h-3 w-32" />
        <SkeletonBlock className="mt-4 h-40 w-full" />
      </div>

      <div className="panel max-lg:order-7 p-5 lg:order-none">
        <SkeletonBlock className="h-3 w-36" />
        <SkeletonBlock className="mt-4 h-20 w-full" />
        <SkeletonBlock className="mt-3 h-20 w-full" />
      </div>

      <div className="max-lg:order-3 grid gap-4 sm:grid-cols-2 lg:order-none">
        <div className="panel p-5">
          <SkeletonBlock className="h-16 w-full" />
        </div>
        <div className="panel p-5">
          <SkeletonBlock className="h-16 w-full" />
        </div>
      </div>

      <div className="panel max-lg:order-8 p-5 lg:order-none lg:col-span-2">
        <SkeletonBlock className="h-3 w-40" />
        <SkeletonBlock className="mt-3 h-3 w-2/3" />
      </div>
    </section>
  );
}
