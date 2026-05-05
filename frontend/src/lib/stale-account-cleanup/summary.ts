import type {
  IdentityAccount,
  StaleAccountPolicy,
} from "./types";
import { evaluateStaleAccountCleanup } from "./stale-account-engine";

export type StaleAccountCleanupSummary = {
  summary: {
    total_accounts: number;
    stale_accounts: number;
    estimated_monthly_savings_usd: number;
  };
  calculation_notes: string[];
};

export function summarizeStaleAccountCleanup(
  accounts: IdentityAccount[],
  policy: StaleAccountPolicy
): StaleAccountCleanupSummary {
  const result = evaluateStaleAccountCleanup(accounts, policy);
  const staleAccounts =
    result.summary.review_required +
    result.summary.eligible_for_suspension +
    result.summary.protected_review;

  return {
    summary: {
      total_accounts: result.summary.total_accounts,
      stale_accounts: staleAccounts,
      estimated_monthly_savings_usd:
        result.summary.estimated_monthly_savings_usd,
    },
    calculation_notes: [
      `Stale Account Cleanup evaluates ${result.summary.total_accounts} mock identity accounts with ${result.policy_name}.`,
      `${staleAccounts} accounts are stale or require protected review; estimated monthly savings is $${result.summary.estimated_monthly_savings_usd.toLocaleString("en-US")}.`,
    ],
  };
}
