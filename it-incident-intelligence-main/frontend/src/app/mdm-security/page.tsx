import { AppShell } from "@/components/layout/AppShell";
import { MdmSecurityDashboard } from "@/components/mdm-security/MdmSecurityDashboard";
import { normalizeEnvironmentScenario } from "@/lib/shared/environment-scenario";
import { getDashboardSummary } from "@/lib/shared/dashboard-summary";

export default async function MdmSecurityPage({
  searchParams,
}: {
  searchParams?: Promise<{ env?: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const scenario = normalizeEnvironmentScenario(resolvedSearchParams?.env);
  const summary = getDashboardSummary(scenario);

  return (
    <AppShell
      moduleTitle="MDM Security"
      moduleEyebrow="Endpoint Security"
      globalRiskScore={summary.globalRiskScore}
      globalRiskLevel={summary.globalRiskLevel}
      lastUpdated={new Date().toISOString()}
      currentScenario={scenario}
    >
      <MdmSecurityDashboard analysis={summary.mdm} />
    </AppShell>
  );
}
