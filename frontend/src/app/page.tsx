import { AppShell } from "@/components/layout/AppShell";
import { OverviewDashboard } from "@/components/overview/OverviewDashboard";
import { normalizeEnvironmentScenario } from "@/lib/shared/environment-scenario";
import { getDashboardSummary } from "@/lib/shared/dashboard-summary";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ env?: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const scenario = normalizeEnvironmentScenario(resolvedSearchParams?.env);
  const summary = getDashboardSummary(scenario);

  return (
    <AppShell
      moduleTitle="Overview"
      moduleEyebrow="Overview Command Center"
      globalRiskScore={summary.globalRiskScore}
      globalRiskLevel={summary.globalRiskLevel}
      lastUpdated={new Date().toISOString()}
      currentScenario={scenario}
    >
      <OverviewDashboard summary={summary} />
    </AppShell>
  );
}
