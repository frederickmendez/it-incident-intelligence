import type { Metadata } from "next";
import { AppShell } from "@/components/shared/app-shell";
import { StaleAccountsDashboard } from "@/components/stale-accounts/stale-accounts-dashboard";
import { staleAccountCandidates } from "@/data/mock/stale-account-cleanup/mock";
import { staleAccountPolicy } from "@/data/policies/stale-account-cleanup/stale-account-policy";
import { buildSlackRecommendation } from "@/lib/stale-account-cleanup/slack-message";
import { evaluateStaleAccountCleanup } from "@/lib/stale-account-cleanup/stale-account-engine";

export const metadata: Metadata = {
  title: "Stale Account Cleanup | Nexus",
  description:
    "Mock-data-driven stale account cleanup dashboard with explainable identity hygiene recommendations.",
};

export default function StaleAccountsPage() {
  const result = evaluateStaleAccountCleanup(
    staleAccountCandidates,
    staleAccountPolicy
  );
  const slackRecommendation = buildSlackRecommendation(result);

  return (
    <AppShell
      activeNavKey="stale-account-cleanup"
      dataSource="mock"
      contentClassName="flex-1 overflow-auto"
    >
      <StaleAccountsDashboard
        result={result}
        slackRecommendation={slackRecommendation}
      />
    </AppShell>
  );
}
