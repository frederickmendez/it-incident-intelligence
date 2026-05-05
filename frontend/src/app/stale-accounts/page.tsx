import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { StaleAccountsDashboard } from "@/components/stale-accounts/stale-accounts-dashboard";
import { staleAccountCandidates } from "@/data/mock/stale-account-cleanup/mock";
import { staleAccountPolicy } from "@/data/policies/stale-account-cleanup/stale-account-policy";
import { normalizeEnvironmentScenario } from "@/lib/shared/environment-scenario";
import { getDashboardSummary } from "@/lib/shared/dashboard-summary";
import { buildSlackRecommendation } from "@/lib/stale-account-cleanup/slack-message";
import { evaluateStaleAccountCleanup } from "@/lib/stale-account-cleanup/stale-account-engine";

export const metadata: Metadata = {
  title: "Stale Account Cleanup | Nexus",
  description:
    "Mock-data-driven stale account cleanup dashboard with explainable identity hygiene recommendations.",
};

export default async function StaleAccountsPage({
  searchParams,
}: {
  searchParams?: Promise<{ env?: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const scenario = normalizeEnvironmentScenario(resolvedSearchParams?.env);
  const summary = getDashboardSummary(scenario);
  const result = evaluateStaleAccountCleanup(
    staleAccountCandidates,
    staleAccountPolicy
  );
  const slackRecommendation = buildSlackRecommendation(result);

  return (
    <AppShell
      moduleTitle="Stale Account Cleanup"
      moduleEyebrow="Legacy Identity Drilldown"
      globalRiskScore={summary.globalRiskScore}
      globalRiskLevel={summary.globalRiskLevel}
      lastUpdated={new Date().toISOString()}
      currentScenario={scenario}
    >
      <StaleAccountsDashboard
        result={result}
        slackRecommendation={slackRecommendation}
      />
    </AppShell>
  );
}
