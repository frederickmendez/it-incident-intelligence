import { SectionPanel } from "@/components/shared/SectionPanel";
import { formatCurrency } from "@/lib/shared/formatCurrency";
import type { CloudCostAnalysis } from "@/lib/cloud-cost/types";

export function CloudSavingsSummary({
  analysis,
}: {
  analysis: CloudCostAnalysis;
}) {
  return (
    <SectionPanel title="Financial Impact Summary" eyebrow="Recommended Actions">
      <div className="space-y-4">
        <p className="text-sm leading-7 text-[var(--nexus-text-soft)]">
          {analysis.financialImpactSummary}
        </p>
        <div className="grid gap-3">
          {analysis.recommendedActions.map((action, index) => (
            <div
              key={`${index}-${action}`}
              className="rounded-[1rem] border border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.52)] px-4 py-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
                Action {index + 1}
              </p>
              <p className="mt-2 text-sm text-[var(--nexus-text)]">{action}</p>
            </div>
          ))}
        </div>
        <div className="rounded-[1rem] border border-[var(--nexus-border-active)] bg-[var(--nexus-ghost)] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
            Estimated Monthly Waste
          </p>
          <p className="mt-2 text-3xl font-semibold text-[var(--nexus-text)]">
            {formatCurrency(analysis.summary.totalMonthlyWasteUsd)}
          </p>
        </div>
      </div>
    </SectionPanel>
  );
}
