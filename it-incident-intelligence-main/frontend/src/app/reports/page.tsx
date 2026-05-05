import { AppShell } from "@/components/layout/AppShell";
import { ReportsDashboard } from "@/components/reports/ReportsDashboard";
import { normalizeEnvironmentScenario } from "@/lib/shared/environment-scenario";
import { getDashboardSummary } from "@/lib/shared/dashboard-summary";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams?: Promise<{ env?: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const scenario = normalizeEnvironmentScenario(resolvedSearchParams?.env);
  const summary = getDashboardSummary(scenario);

  return (
    <AppShell
      moduleTitle="Reports"
      moduleEyebrow="Executive Summary Center"
      globalRiskScore={summary.globalRiskScore}
      globalRiskLevel={summary.globalRiskLevel}
      lastUpdated={new Date().toISOString()}
      currentScenario={scenario}
    >
      <ReportsDashboard summary={summary} />
    </AppShell>
  );
}
