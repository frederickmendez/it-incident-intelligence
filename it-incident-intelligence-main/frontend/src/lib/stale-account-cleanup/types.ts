export type IdentityProvider = "Azure AD" | "Okta" | "Google Workspace";

export type AccountLifecycleState = "active" | "inactive" | "disabled" | "pending_deprovision";

export type PrivilegeLevel = "standard" | "elevated" | "admin" | "break_glass";

export type AccountType = "employee" | "contractor" | "service_account" | "shared_mailbox";

export type StaleAccountStatus =
  | "active"
  | "review_required"
  | "eligible_for_suspension"
  | "protected_review";

export type StaleAccountAction =
  | "no_action"
  | "manager_review"
  | "suspend_account"
  | "service_account_review"
  | "protected_review";

export type IdentityAccount = {
  id: string;
  provider: IdentityProvider;
  display_name: string;
  email: string;
  account_type: AccountType;
  lifecycle_state: AccountLifecycleState;
  department: string;
  manager_email: string | null;
  privilege_level: PrivilegeLevel;
  groups_count: number;
  privileged_groups: string[];
  mfa_enabled: boolean;
  last_sign_in_at: string | null;
  created_at: string;
  password_last_changed_at: string | null;
  owner_confirmed_active: boolean;
  business_justification: string | null;
};

export type StaleAccountPolicy = {
  id: string;
  name: string;
  inactive_days_threshold: number;
  privileged_inactive_days_threshold: number;
  contractor_inactive_days_threshold: number;
  service_account_review_days: number;
  require_manager_confirmation: boolean;
  protected_departments: string[];
  protected_groups: string[];
  protected_break_glass_accounts: string[];
  monthly_license_cost_usd: number;
  policy_owner: string;
};

export type StaleAccountSavings = {
  estimated_monthly_usd: number;
  estimated_annual_usd: number;
};

export type StaleAccountRuleHit = {
  rule_id: string;
  status: StaleAccountStatus;
  expected_value: string | number | boolean | null;
  observed_value: string | number | boolean | null;
  reason: string;
};

export type StaleAccountResult = {
  account_id: string;
  display_name: string;
  email: string;
  provider: IdentityProvider;
  department: string;
  account_type: AccountType;
  privilege_level: PrivilegeLevel;
  lifecycle_state: AccountLifecycleState;
  status: StaleAccountStatus;
  recommended_action: StaleAccountAction;
  inactivity_days: number;
  inactivity_reference_at: string;
  protected_by: string[];
  savings: StaleAccountSavings;
  reasons: string[];
  rule_hits: StaleAccountRuleHit[];
};

export type StaleAccountSummary = {
  total_accounts: number;
  active: number;
  review_required: number;
  eligible_for_suspension: number;
  protected_review: number;
  estimated_monthly_savings_usd: number;
  estimated_annual_savings_usd: number;
  automatic_suspension_monthly_savings_usd: number;
  automatic_suspension_annual_savings_usd: number;
};

export type StaleAccountCleanupResult = {
  policy_id: string;
  policy_name: string;
  as_of_date: string;
  summary: StaleAccountSummary;
  items: StaleAccountResult[];
};

export type SlackRecommendation = {
  text: string;
  sections: string[];
  highest_risk_accounts: string[];
};

export type StaleAccountReportRow = {
  account_id: string;
  display_name: string;
  email: string;
  provider: IdentityProvider;
  department: string;
  account_type: AccountType;
  privilege_level: PrivilegeLevel;
  inactivity_days: number;
  status: StaleAccountStatus;
  recommended_action: StaleAccountAction;
  estimated_monthly_savings_usd: number;
  estimated_annual_savings_usd: number;
  protected_by: string;
  reasons: string;
};
