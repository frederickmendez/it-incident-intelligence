import type { StaleAccountCleanupResult, StaleAccountReportRow } from "./types";

export function buildStaleAccountReport(result: StaleAccountCleanupResult): StaleAccountReportRow[] {
  return result.items.map((item) => ({
    account_id: item.account_id,
    display_name: item.display_name,
    email: item.email,
    provider: item.provider,
    department: item.department,
    account_type: item.account_type,
    privilege_level: item.privilege_level,
    inactivity_days: item.inactivity_days,
    status: item.status,
    recommended_action: item.recommended_action,
    estimated_monthly_savings_usd: item.savings.estimated_monthly_usd,
    estimated_annual_savings_usd: item.savings.estimated_annual_usd,
    protected_by: item.protected_by.join("; "),
    reasons: item.reasons.join("; "),
  }));
}

