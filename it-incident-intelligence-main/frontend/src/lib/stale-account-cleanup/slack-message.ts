import type { SlackRecommendation, StaleAccountCleanupResult } from "./types";

export function buildSlackRecommendation(result: StaleAccountCleanupResult): SlackRecommendation {
  const highestRiskAccounts = result.items
    .filter((item) => item.status === "eligible_for_suspension" || item.status === "review_required")
    .sort((left, right) => right.inactivity_days - left.inactivity_days)
    .slice(0, 3)
    .map((item) => `${item.display_name} (${item.provider}, ${item.inactivity_days} inactive days)`);

  const text = [
    `Stale Account Cleanup: ${result.summary.eligible_for_suspension} accounts are eligible for suspension and ${result.summary.review_required} require review.`,
    `Estimated monthly savings: $${result.summary.estimated_monthly_savings_usd.toLocaleString("en-US")}.`,
    `Protected review queue: ${result.summary.protected_review} accounts.`,
  ].join(" ");

  return {
    text,
    sections: [
      `Policy: ${result.policy_name}`,
      `Automatic suspension candidates: ${result.summary.eligible_for_suspension}`,
      `Manual review required: ${result.summary.review_required}`,
      `Protected review: ${result.summary.protected_review}`,
      `Estimated annual savings: $${result.summary.estimated_annual_savings_usd.toLocaleString("en-US")}`,
    ],
    highest_risk_accounts: highestRiskAccounts,
  };
}

export function buildSlackRecommendationText(result: StaleAccountCleanupResult): string {
  const recommendation = buildSlackRecommendation(result);
  return [recommendation.text, ...recommendation.sections, ...recommendation.highest_risk_accounts].join("\n");
}

