import { KpiCard } from "@/components/shared/KpiCard";
import { formatCurrency } from "@/lib/shared/formatCurrency";
import type { DashboardSummary } from "@/lib/shared/dashboard-summary";

export function ExportSummaryCards({
  summary,
}: {
  summary: DashboardSummary;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Scenario" value={summary.scenario.shortLabel} description={summary.scenario.subtitle} riskLevel={summary.globalRiskLevel} variant={summary.scenario.accent} />
      <KpiCard label="Cloud Waste" value={formatCurrency(summary.totalMonthlyCloudWaste)} description="Mock export-ready monthly cloud waste figure." riskLevel={summary.cloud.summary.dominantRiskLevel} variant="green" />
      <KpiCard label="Security Incidents" value={String(summary.activeSecurityIncidents)} description="Mock export-ready security incident count." riskLevel={summary.sentinel.summary.dominantRiskLevel} variant="red" />
      <KpiCard label="Identity Savings" value={formatCurrency(summary.staleAccounts.summary.estimated_monthly_savings_usd)} description="Mock export-ready identity license savings estimate." riskLevel="medium" variant="gold" />
    </div>
  );
}
