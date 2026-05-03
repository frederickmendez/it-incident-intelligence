import type {
  SlackRecommendation,
  StaleAccountCleanupResult,
} from "@/lib/stale-account-cleanup/types";
import { AccountsTable } from "./accounts-table";
import { ExclusionPanel } from "./exclusion-panel";
import { SavingsPanel } from "./savings-panel";
import { SlackPreview } from "./slack-preview";
import { SummaryCards } from "./summary-cards";

export function StaleAccountsDashboard({
  result,
  slackRecommendation,
}: {
  result: StaleAccountCleanupResult;
  slackRecommendation: SlackRecommendation;
}) {
  return (
    <div className="min-h-full bg-[var(--bg-base)] px-5 py-6 text-[var(--text-primary)] md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <section className="glass-card-elevated border-l-4 border-[var(--violet)] p-5 animate-in">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="section-title mb-2">Nexus IT Operations & Security Suite</p>
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                Stale Account Cleanup
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
                Mock Okta, Azure AD, and Google Workspace identities are evaluated by the deterministic cleanup engine. The dashboard only displays analyzed results, including recommended actions, savings, and policy-backed exclusion reasons.
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Policy
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                {result.policy_name}
              </p>
              <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                {result.policy_id}
              </p>
            </div>
          </div>
        </section>

        <SummaryCards summary={result.summary} asOfDate={result.as_of_date} />

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1fr]">
          <SavingsPanel summary={result.summary} />
          <SlackPreview recommendation={slackRecommendation} />
        </section>

        <AccountsTable items={result.items} />
        <ExclusionPanel items={result.items} />
      </div>
    </div>
  );
}
