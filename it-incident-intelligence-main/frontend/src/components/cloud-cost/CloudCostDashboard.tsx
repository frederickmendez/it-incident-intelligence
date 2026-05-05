import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { SectionPanel } from "@/components/shared/SectionPanel";
import { formatCurrency } from "@/lib/shared/formatCurrency";
import type { CloudCostAnalysis } from "@/lib/cloud-cost/types";
import { CloudSavingsSummary } from "./CloudSavingsSummary";
import { CloudWasteTable } from "./CloudWasteTable";

const PROVIDER_COLORS = ["var(--nexus-green)", "var(--nexus-blue)", "var(--nexus-warning)", "var(--nexus-purple)"];

export function CloudCostDashboard({
  analysis,
}: {
  analysis: CloudCostAnalysis;
}) {
  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Cloud Cost Auditor"
        title="Waste detection for FinOps review"
        description="FinOps-style visibility over idle servers, unattached disks, and orphaned resources using deterministic mock analysis."
        aside={
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--nexus-text-muted)]">
              Immediate Savings
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--nexus-text)]">
              {formatCurrency(analysis.summary.totalMonthlyWasteUsd)}
            </p>
            <p className="mt-2 text-sm text-[var(--nexus-text-soft)]">
              {analysis.summary.optimizationCandidates} optimization candidates across AWS, Azure, and GCP mock accounts.
            </p>
          </div>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        <KpiCard label="Total Waste" value={formatCurrency(analysis.summary.totalMonthlyWasteUsd)} description="Estimated monthly spend that can be recovered without changing the product scope." riskLevel={analysis.summary.dominantRiskLevel} variant="green" />
        <KpiCard label="Optimization Candidates" value={String(analysis.summary.optimizationCandidates)} description="Resources with explainable waste signals and recommended follow-up actions." riskLevel={analysis.summary.dominantRiskLevel} variant="blue" />
        <KpiCard label="Healthy Spend" value={formatCurrency(analysis.summary.healthySpendUsd)} description="Remaining monthly spend that currently aligns with active usage and workload need." riskLevel="low" variant="green" />
        <KpiCard label="Idle Servers" value={String(analysis.summary.idleServers)} description="Compute resources with low utilization and persistent cost burn." riskLevel={analysis.summary.idleServers > 1 ? "high" : "medium"} variant="orange" />
        <KpiCard label="Unattached Disks" value={String(analysis.summary.unattachedDisks)} description="Persistent storage detached from workloads but still charging monthly." riskLevel={analysis.summary.unattachedDisks > 1 ? "high" : "medium"} variant="purple" />
        <KpiCard label="Orphaned Resources" value={String(analysis.summary.orphanedResources)} description="Assets left behind outside clear ownership or active workloads." riskLevel={analysis.summary.orphanedResources > 0 ? "high" : "low"} variant="red" />
        <KpiCard label="Top Single Waste" value={formatCurrency(analysis.summary.highestCostWasteUsd)} description="Largest individual candidate by estimated monthly waste opportunity." riskLevel={analysis.summary.highestCostWasteUsd > 200 ? "critical" : "high"} variant="gold" />
        <KpiCard label="Recoverable Spend Ratio" value={`${analysis.summary.recoverableSpendRatio}%`} description="Share of total monthly spend that the current scenario marks as recoverable waste." riskLevel={analysis.summary.recoverableSpendRatio >= 30 ? "critical" : analysis.summary.recoverableSpendRatio >= 18 ? "high" : "medium"} variant="orange" />
      </section>

      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1fr_1fr_0.9fr]">
        <SectionPanel title="Waste by Provider" eyebrow="Provider Exposure">
          <DonutChart
            centerLabel="Waste"
            centerValue={formatCurrency(analysis.summary.totalMonthlyWasteUsd)}
            segments={analysis.byProvider.map((item, index) => ({
              label: item.provider,
              value: item.resourceCount,
              color: PROVIDER_COLORS[index % PROVIDER_COLORS.length],
            }))}
          />
        </SectionPanel>
        <SectionPanel title="Waste by Resource Type" eyebrow="Optimization Targets">
          <BarChart
            items={analysis.byResourceType.map((item, index) => ({
              label: item.resourceType,
              value: item.totalMonthlyWasteUsd,
              color: PROVIDER_COLORS[index % PROVIDER_COLORS.length],
            }))}
            valueFormatter={formatCurrency}
          />
        </SectionPanel>
        <SectionPanel title="Top Three Actions" eyebrow="Savings Storyline">
          <div className="space-y-3">
            {analysis.recommendedActions.slice(0, 3).map((action, index) => (
              <div
                key={`${index}-${action}`}
                className="rounded-[1rem] border border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.52)] px-4 py-3"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
                  Action {index + 1}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--nexus-text)]">
                  {action}
                </p>
              </div>
            ))}
          </div>
        </SectionPanel>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionPanel title="Optimization Candidate Table" eyebrow="Resource Detail">
          <CloudWasteTable rows={analysis.items} />
        </SectionPanel>
        <CloudSavingsSummary analysis={analysis} />
      </section>
    </div>
  );
}
