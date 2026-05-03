import type { StaleAccountPolicy } from "../../../lib/stale-account-cleanup/types";

export const staleAccountPolicy = {
  id: "policy-identity-hygiene-2026",
  name: "Enterprise Stale Account Cleanup Policy",
  inactive_days_threshold: 60,
  privileged_inactive_days_threshold: 30,
  contractor_inactive_days_threshold: 45,
  service_account_review_days: 60,
  require_manager_confirmation: true,
  protected_departments: ["Security", "Human Resources"],
  protected_groups: ["Okta-Super-Admins", "Privileged-Role-Admins", "Incident-Emergency-Access"],
  protected_break_glass_accounts: ["okta-breakglass-01", "aad-breakglass-02"],
  monthly_license_cost_usd: 18,
  policy_owner: "identity-governance@northwind.example",
} satisfies StaleAccountPolicy;
