import { TotalScoreGauge } from "@/components/TotalScoreGauge";
import { ImpactBreakdownBar } from "@/components/ImpactBreakdownBar";

interface VisualSummaryProps {
  score_summary: { optionA_total: number; optionB_total: number };
  score_breakdown: {
    cost: { weight: number; impact: number };
    growth: { weight: number; impact: number };
    risk: { weight: number; impact: number };
    goal_alignment: { weight: number; impact: number };
  };
}

export function VisualSummary({ score_summary, score_breakdown }: VisualSummaryProps) {
  return (
    <div className="flex flex-col gap-4">
      <TotalScoreGauge
        optionA_total={score_summary.optionA_total}
        optionB_total={score_summary.optionB_total}
      />
      <ImpactBreakdownBar breakdown={score_breakdown} />
    </div>
  );
}

