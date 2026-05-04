"use client";

import { useState } from "react";

import { CategoryGroupedBars } from "@/components/CategoryGroupedBars";
import { CategoryRadar } from "@/components/CategoryRadar";
import { ImpactBreakdownBar } from "@/components/ImpactBreakdownBar";
import { ResultCard } from "@/components/ResultCard";
import type { DecisionResponse } from "@/lib/types";

type TabId = "snapshot" | "model";

interface MetricsDeepTabsProps {
  scoreSummary: NonNullable<DecisionResponse["recommendation"]["score_summary"]>;
  scoreBreakdown: NonNullable<DecisionResponse["recommendation"]["score_breakdown"]>;
  agents: DecisionResponse["agents"];
}

export function MetricsDeepTabs({ scoreSummary, scoreBreakdown, agents }: MetricsDeepTabsProps) {
  const [tab, setTab] = useState<TabId>("snapshot");

  const hasAgentBody =
    Boolean(agents.cost) || Boolean(agents.growth) || Boolean(agents.risk) || Boolean(agents.goal_alignment);

  const tabs: { id: TabId; label: string; hint: string }[] = [
    { id: "snapshot", label: "Snapshot", hint: "Totals & drivers" },
    { id: "model", label: "Model detail", hint: "Radar & agents" }
  ];

  return (
    <section
      className="rounded-2xl border border-borderSubtle bg-surface p-5 shadow-panel sm:p-6"
      aria-label="Extended metrics"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-inkMuted">Deeper metrics</h3>
          <p className="mt-1 text-sm text-inkMuted">
            Rubric detail and weighted impact—headline weighted totals stay in{" "}
            <span className="font-medium text-ink">Weighted model totals</span> above.
          </p>
        </div>
        <div
          className="inline-flex rounded-full border border-borderSubtle bg-surfaceMuted p-1"
          role="tablist"
          aria-label="Metrics views"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 ${
                tab === t.id ? "bg-slate-900 text-white shadow-sm" : "text-inkMuted hover:text-ink"
              }`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5" role="tabpanel">
        {tab === "snapshot" ? (
          <div className="space-y-4">
            <p className="text-sm text-inkMuted">
              Snapshot focuses on <span className="font-medium text-ink">how rubric dimensions</span> moved the
              weighted call. Open <span className="font-medium text-ink">Model detail</span> for side-by-side
              rubric bars and the radar.
            </p>
            <ImpactBreakdownBar breakdown={scoreBreakdown} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border border-borderSubtle bg-surfaceMuted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-inkMuted">Rubric scores by category</p>
              <p className="mt-1 text-sm text-inkMuted">
                Same rubric scores as the radar, shown as grouped bars for quick A/B comparison (0–10 scale).
              </p>
              <div className="mt-4 h-64 w-full min-w-0 sm:h-72">
                <CategoryGroupedBars agents={agents} />
              </div>
            </div>
            <div className="rounded-xl border border-borderSubtle bg-surfaceMuted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-inkMuted">Category radar</p>
              <p className="mt-1 text-sm text-inkMuted">Cost, growth, risk, and alignment on the same rubric scale.</p>
              <div className="mt-2 min-h-72 w-full min-w-0">
                <CategoryRadar agents={agents} />
              </div>
            </div>

            {hasAgentBody ? (
              <div className="grid gap-4 md:grid-cols-2">
                {agents.cost ? (
                  <ResultCard
                    title="Cost analysis"
                    analysis={agents.cost.analysis}
                    scoreA={agents.cost.scoreA}
                    scoreB={agents.cost.scoreB}
                    weight={scoreBreakdown.cost.weight}
                    impact={scoreBreakdown.cost.impact}
                  />
                ) : null}
                {agents.growth ? (
                  <ResultCard
                    title="Growth analysis"
                    analysis={agents.growth.analysis}
                    scoreA={agents.growth.scoreA}
                    scoreB={agents.growth.scoreB}
                    weight={scoreBreakdown.growth.weight}
                    impact={scoreBreakdown.growth.impact}
                  />
                ) : null}
                {agents.risk ? (
                  <ResultCard
                    title="Risk analysis"
                    analysis={agents.risk.analysis}
                    scoreA={agents.risk.scoreA}
                    scoreB={agents.risk.scoreB}
                    weight={scoreBreakdown.risk.weight}
                    impact={scoreBreakdown.risk.impact}
                  />
                ) : null}
                {agents.goal_alignment ? (
                  <ResultCard
                    title="Goal alignment"
                    analysis={agents.goal_alignment.analysis}
                    scoreA={agents.goal_alignment.scoreA}
                    scoreB={agents.goal_alignment.scoreB}
                    weight={scoreBreakdown.goal_alignment.weight}
                    impact={scoreBreakdown.goal_alignment.impact}
                  />
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-inkMuted">No agent narratives were returned for this decision.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
