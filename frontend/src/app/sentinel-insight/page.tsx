import { AppShell } from "@/components/layout/AppShell";
import { SentinelDashboard } from "@/components/sentinel-insight/SentinelDashboard";
import { normalizeEnvironmentScenario } from "@/lib/shared/environment-scenario";
import { getDashboardSummary } from "@/lib/shared/dashboard-summary";

export default async function SentinelInsightPage({
  searchParams,
}: {
  searchParams?: Promise<{ env?: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const scenario = normalizeEnvironmentScenario(resolvedSearchParams?.env);
  const summary = getDashboardSummary(scenario);

  return (
    <AppShell
      moduleTitle="Sentinel Insight"
      moduleEyebrow="Security Operations"
      globalRiskScore={summary.globalRiskScore}
      globalRiskLevel={summary.globalRiskLevel}
      lastUpdated={new Date().toISOString()}
      currentScenario={scenario}
    >
      <SentinelDashboard analysis={summary.sentinel} />
    </AppShell>
  );
}
