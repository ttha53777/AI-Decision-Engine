"use client";

import { BottomLineInsight } from "@/components/results/BottomLineInsight";
import { ExecutiveStrip } from "@/components/results/ExecutiveStrip";
import { MetricsDeepTabs } from "@/components/results/MetricsDeepTabs";
import { PriorityBreakdown } from "@/components/results/PriorityBreakdown";
import { RecommendationCard } from "@/components/results/RecommendationCard";
import { ResultsSectionNav } from "@/components/results/ResultsSectionNav";
import { RiskRewardCard } from "@/components/results/RiskRewardCard";
import { ScenarioAnalysis } from "@/components/results/ScenarioAnalysis";
import { ScoreComparison } from "@/components/results/ScoreComparison";
import { TradeoffCard } from "@/components/results/TradeoffCard";
import { WhyThisWon } from "@/components/results/WhyThisWon";
import { useBreakpointLg } from "@/hooks/useBreakpointLg";
import { buildResultsViewModel } from "@/lib/resultsViewModel";
import type { DecisionResponse } from "@/lib/types";

function OptionContextHeader({ optionA, optionB }: { optionA: string; optionB: string }) {
  return (
    <header className="rounded-2xl border border-borderSubtle bg-surface px-5 py-5 shadow-panelLg sm:px-6 sm:py-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-inkMuted">Decision context</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="min-w-0 rounded-xl border border-optionA/20 bg-optionA-soft/40 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-optionA">Option A</p>
          <p className="mt-1 line-clamp-3 text-sm font-medium text-ink" title={optionA}>
            {optionA || "—"}
          </p>
        </div>
        <div className="min-w-0 rounded-xl border border-optionB/20 bg-optionB-soft/40 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-optionB">Option B</p>
          <p className="mt-1 line-clamp-3 text-sm font-medium text-ink" title={optionB}>
            {optionB || "—"}
          </p>
        </div>
      </div>
    </header>
  );
}

interface DecisionResultsSplitProps {
  optionA: string;
  optionB: string;
  priorities: string[];
  result: DecisionResponse;
}

export function DecisionResultsSplit({ optionA, optionB, priorities, result }: DecisionResultsSplitProps) {
  const wide = useBreakpointLg();
  const vm = buildResultsViewModel(optionA, optionB, priorities, result);

  const scoreSummary = result.recommendation.score_summary;
  const scoreBreakdown = result.recommendation.score_breakdown;
  const confidence = result.recommendation.confidence;
  const scenarioAnalysis = result.recommendation.scenario_analysis ?? {
    optionA_best_case: "Provide more context to generate scenario analysis.",
    optionA_worst_case: "Provide more context to generate scenario analysis.",
    optionB_best_case: "Provide more context to generate scenario analysis.",
    optionB_worst_case: "Provide more context to generate scenario analysis."
  };
  const sensitivityLines = result.recommendation.what_would_change ?? [];

  if (!vm) {
    return null;
  }

  const recommendationBlock = (
    <RecommendationCard
      winnerLabel={vm.winner}
      optionTitle={vm.winnerOptionTitle}
      confidence={vm.confidenceLabel}
      strengthPercent={vm.strengthPercent}
      headlineSummary={vm.headlineSummary}
      supportingReason={vm.supportingReason}
      confidenceReason={result.recommendation.confidence_reason}
    />
  );

  const scoresBlock =
    scoreSummary && scoreBreakdown ? (
      <ScoreComparison
        optionALabel={optionA}
        optionBLabel={optionB}
        optionA_total={scoreSummary.optionA_total}
        optionB_total={scoreSummary.optionB_total}
        winner={vm.winner}
      />
    ) : (
      <section className="rounded-2xl border border-dashed border-borderSubtle bg-surface p-6 text-sm text-inkMuted shadow-panel">
        Weighted score comparison needs totals from the API for this response.
      </section>
    );

  const whyBlock = <WhyThisWon bullets={vm.whyBullets} priorities={priorities} />;
  const tradeBlock = <TradeoffCard tradeoffs={vm.tradeoffs} />;
  const bottomBlock = <BottomLineInsight text={vm.bottomLine} />;
  const priorityBlock = <PriorityBreakdown rows={vm.priorityRows} />;
  const riskBlock = <RiskRewardCard view={vm.riskReward} />;
  const scenarioBlock = (
    <ScenarioAnalysis
      optionA_best_case={scenarioAnalysis.optionA_best_case}
      optionA_worst_case={scenarioAnalysis.optionA_worst_case}
      optionB_best_case={scenarioAnalysis.optionB_best_case}
      optionB_worst_case={scenarioAnalysis.optionB_worst_case}
      sensitivityLines={sensitivityLines}
    />
  );

  const deepBlock =
    scoreSummary && scoreBreakdown ? (
      <MetricsDeepTabs scoreSummary={scoreSummary} scoreBreakdown={scoreBreakdown} agents={result.agents} />
    ) : null;

  const narrativeRowSpan = deepBlock ? "lg:row-span-5" : "lg:row-span-4";

  const executiveStrip =
    scoreSummary ? (
      <ExecutiveStrip
        winnerLabel={vm.winner}
        confidence={confidence}
        optionA_total={scoreSummary.optionA_total}
        optionB_total={scoreSummary.optionB_total}
      />
    ) : null;

  return (
    <div className="space-y-6">
      <OptionContextHeader optionA={optionA} optionB={optionB} />
      {executiveStrip}
      <ResultsSectionNav />

      {wide ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(300px,400px)_1fr] lg:gap-x-10 lg:gap-y-6 lg:items-start">
          <aside
            id="recommendation"
            className={`flex flex-col gap-6 scroll-mt-36 lg:sticky lg:top-28 lg:col-start-1 lg:row-start-1 lg:self-start ${narrativeRowSpan}`}
          >
            {recommendationBlock}
            {whyBlock}
            {tradeBlock}
            {bottomBlock}
          </aside>

          <div className="lg:col-start-2 lg:row-start-1">{scoresBlock}</div>
          <div id="priorities" className="scroll-mt-36 lg:col-start-2 lg:row-start-2">
            {priorityBlock}
          </div>
          <div id="risk" className="scroll-mt-36 lg:col-start-2 lg:row-start-3">
            {riskBlock}
          </div>
          <div className="scroll-mt-36 lg:col-start-2 lg:row-start-4">{scenarioBlock}</div>
          {deepBlock ? (
            <div id="metrics" className="scroll-mt-36 lg:col-start-2 lg:row-start-5">
              {deepBlock}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div id="recommendation" className="scroll-mt-36">
            {recommendationBlock}
          </div>
          {scoresBlock}
          {whyBlock}
          {tradeBlock}
          {bottomBlock}
          <div id="priorities" className="scroll-mt-36">
            {priorityBlock}
          </div>
          <div id="risk" className="scroll-mt-36">
            {riskBlock}
          </div>
          <div className="scroll-mt-36">{scenarioBlock}</div>
          {deepBlock ? <div id="metrics" className="scroll-mt-36">{deepBlock}</div> : null}
        </div>
      )}
    </div>
  );
}
