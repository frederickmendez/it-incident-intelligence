import type {
  IdentityAccount,
  StaleAccountAction,
  StaleAccountCleanupResult,
  StaleAccountPolicy,
  StaleAccountResult,
  StaleAccountRuleHit,
  StaleAccountSavings,
  StaleAccountStatus,
} from "./types";

const DEFAULT_AS_OF_DATE = "2026-05-01T00:00:00Z";
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function evaluateAccountStaleness(
  account: IdentityAccount,
  policy: StaleAccountPolicy,
  asOfDate: string = DEFAULT_AS_OF_DATE
): StaleAccountResult {
  const asOf = parseDate(asOfDate);
  const inactivityReference = account.last_sign_in_at ?? account.created_at;
  const referenceDate = parseDate(inactivityReference);
  const inactivityDays = Math.max(0, Math.floor((asOf.getTime() - referenceDate.getTime()) / MS_PER_DAY));
  const threshold = thresholdForAccount(account, policy);
  const protectedBy = protectedReasons(account, policy);
  const isStale = inactivityDays >= threshold || account.lifecycle_state === "inactive" || account.lifecycle_state === "pending_deprovision";
  const reasons: string[] = [];
  const ruleHits: StaleAccountRuleHit[] = [];

  if (account.last_sign_in_at == null) {
    reasons.push(`${account.display_name} has never signed in; created_at is used as the inactivity reference.`);
    ruleHits.push(
      buildRuleHit(
        "missing_last_sign_in",
        "review_required",
        "last_sign_in_at",
        null,
        `${account.display_name} has no last sign-in timestamp.`
      )
    );
  }

  ruleHits.push(
    buildRuleHit(
      "inactivity_threshold",
      isStale ? "review_required" : "active",
      threshold,
      inactivityDays,
      `${account.display_name} has been inactive for ${inactivityDays} days; policy threshold is ${threshold} days.`
    )
  );

  if (!isStale) {
    return buildResult({
      account,
      status: "active",
      recommendedAction: "no_action",
      inactivityDays,
      inactivityReference,
      protectedBy,
      savings: zeroSavings(),
      reasons: [`${account.display_name} is active; inactivity is below the applicable policy threshold.`],
      ruleHits,
    });
  }

  reasons.push(`${account.display_name} is stale: ${inactivityDays} inactive days meets or exceeds the ${threshold}-day policy threshold.`);

  if (protectedBy.length > 0) {
    ruleHits.push(
      buildRuleHit(
        "protected_scope",
        "protected_review",
        "not protected",
        protectedBy.join(", "),
        `${account.display_name} is protected from automatic suspension by policy scope.`
      )
    );
    reasons.push(`${account.display_name} is excluded from automatic suspension by ${protectedBy.join(", ")}.`);
    return buildResult({
      account,
      status: "protected_review",
      recommendedAction: "protected_review",
      inactivityDays,
      inactivityReference,
      protectedBy,
      savings: zeroSavings(),
      reasons,
      ruleHits,
    });
  }

  if (requiresManualReview(account)) {
    const savings = estimatedSavings(policy);
    ruleHits.push(
      buildRuleHit(
        "manual_review_required",
        "review_required",
        "standard employee or contractor account",
        `${account.account_type}/${account.privilege_level}`,
        `${account.display_name} requires human review before cleanup because of account type or privilege.`
      )
    );
    reasons.push(`${account.display_name} requires review before cleanup because it is a ${account.account_type} with ${account.privilege_level} privilege.`);
    return buildResult({
      account,
      status: "review_required",
      recommendedAction: account.account_type === "service_account" ? "service_account_review" : "manager_review",
      inactivityDays,
      inactivityReference,
      protectedBy,
      savings,
      reasons,
      ruleHits,
    });
  }

  const savings = estimatedSavings(policy);
  ruleHits.push(
    buildRuleHit(
      "eligible_for_suspension",
      "eligible_for_suspension",
      true,
      true,
      `${account.display_name} is stale and has no protected policy scope.`
    )
  );
  reasons.push(`${account.display_name} is eligible for suspension after manager confirmation.`);

  return buildResult({
    account,
    status: "eligible_for_suspension",
    recommendedAction: policy.require_manager_confirmation ? "manager_review" : "suspend_account",
    inactivityDays,
    inactivityReference,
    protectedBy,
    savings,
    reasons,
    ruleHits,
  });
}

export function evaluateStaleAccountCleanup(
  accounts: IdentityAccount[],
  policy: StaleAccountPolicy,
  asOfDate: string = DEFAULT_AS_OF_DATE
): StaleAccountCleanupResult {
  const items = accounts.map((account) => evaluateAccountStaleness(account, policy, asOfDate));
  const estimatedMonthlySavings = sumSavings(items, (item) => item.status !== "active" && item.status !== "protected_review");
  const automaticMonthlySavings = sumSavings(items, (item) => item.status === "eligible_for_suspension");

  return {
    policy_id: policy.id,
    policy_name: policy.name,
    as_of_date: asOfDate,
    summary: {
      total_accounts: items.length,
      active: items.filter((item) => item.status === "active").length,
      review_required: items.filter((item) => item.status === "review_required").length,
      eligible_for_suspension: items.filter((item) => item.status === "eligible_for_suspension").length,
      protected_review: items.filter((item) => item.status === "protected_review").length,
      estimated_monthly_savings_usd: estimatedMonthlySavings,
      estimated_annual_savings_usd: estimatedMonthlySavings * 12,
      automatic_suspension_monthly_savings_usd: automaticMonthlySavings,
      automatic_suspension_annual_savings_usd: automaticMonthlySavings * 12,
    },
    items,
  };
}

function thresholdForAccount(account: IdentityAccount, policy: StaleAccountPolicy): number {
  if (account.account_type === "contractor") return policy.contractor_inactive_days_threshold;
  if (account.account_type === "service_account" || account.account_type === "shared_mailbox") return policy.service_account_review_days;
  if (account.privilege_level === "elevated" || account.privilege_level === "admin" || account.privilege_level === "break_glass") {
    return policy.privileged_inactive_days_threshold;
  }
  return policy.inactive_days_threshold;
}

function protectedReasons(account: IdentityAccount, policy: StaleAccountPolicy): string[] {
  const reasons: string[] = [];
  if (policy.protected_departments.includes(account.department)) {
    reasons.push(`protected department: ${account.department}`);
  }
  for (const group of account.privileged_groups) {
    if (policy.protected_groups.includes(group)) {
      reasons.push(`protected group: ${group}`);
    }
  }
  if (policy.protected_break_glass_accounts.includes(account.id) || account.privilege_level === "break_glass") {
    reasons.push(`protected break-glass account: ${account.id}`);
  }
  return reasons;
}

function requiresManualReview(account: IdentityAccount): boolean {
  return (
    account.account_type === "service_account" ||
    account.account_type === "shared_mailbox" ||
    account.privilege_level === "elevated" ||
    account.privilege_level === "admin" ||
    account.privilege_level === "break_glass"
  );
}

function estimatedSavings(policy: StaleAccountPolicy): StaleAccountSavings {
  return {
    estimated_monthly_usd: policy.monthly_license_cost_usd,
    estimated_annual_usd: policy.monthly_license_cost_usd * 12,
  };
}

function zeroSavings(): StaleAccountSavings {
  return {
    estimated_monthly_usd: 0,
    estimated_annual_usd: 0,
  };
}

function sumSavings(items: StaleAccountResult[], predicate: (item: StaleAccountResult) => boolean): number {
  return items.reduce((total, item) => total + (predicate(item) ? item.savings.estimated_monthly_usd : 0), 0);
}

function parseDate(value: string): Date {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  return parsed;
}

function buildRuleHit(
  ruleId: string,
  status: StaleAccountStatus,
  expectedValue: string | number | boolean | null,
  observedValue: string | number | boolean | null,
  reason: string
): StaleAccountRuleHit {
  return {
    rule_id: ruleId,
    status,
    expected_value: expectedValue,
    observed_value: observedValue,
    reason,
  };
}

function buildResult(input: {
  account: IdentityAccount;
  status: StaleAccountStatus;
  recommendedAction: StaleAccountAction;
  inactivityDays: number;
  inactivityReference: string;
  protectedBy: string[];
  savings: StaleAccountSavings;
  reasons: string[];
  ruleHits: StaleAccountRuleHit[];
}): StaleAccountResult {
  return {
    account_id: input.account.id,
    display_name: input.account.display_name,
    email: input.account.email,
    provider: input.account.provider,
    department: input.account.department,
    account_type: input.account.account_type,
    privilege_level: input.account.privilege_level,
    lifecycle_state: input.account.lifecycle_state,
    status: input.status,
    recommended_action: input.recommendedAction,
    inactivity_days: input.inactivityDays,
    inactivity_reference_at: input.inactivityReference,
    protected_by: input.protectedBy,
    savings: input.savings,
    reasons: input.reasons,
    rule_hits: input.ruleHits,
  };
}
