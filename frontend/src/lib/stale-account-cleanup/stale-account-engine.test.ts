import { describe, expect, it } from "vitest";
import { staleAccountCandidates } from "@/data/mock/stale-account-cleanup/mock";
import { staleAccountPolicy } from "@/data/policies/stale-account-cleanup/stale-account-policy";
import { buildStaleAccountReport } from "./export-report";
import { buildSlackRecommendation } from "./slack-message";
import { evaluateAccountStaleness, evaluateStaleAccountCleanup } from "./stale-account-engine";

const AS_OF_DATE = "2026-05-01T00:00:00Z";

function findAccount(accountId: string) {
  const account = staleAccountCandidates.find((item) => item.id === accountId);
  if (!account) {
    throw new Error(`Missing test account: ${accountId}`);
  }
  return account;
}

describe("evaluateAccountStaleness", () => {
  it("marks standard users inactive for 60+ days as eligible for suspension", () => {
    const result = evaluateAccountStaleness(findAccount("aad-u-10091"), staleAccountPolicy, AS_OF_DATE);

    expect(result.status).toBe("eligible_for_suspension");
    expect(result.recommended_action).toBe("manager_review");
    expect(result.inactivity_days).toBeGreaterThanOrEqual(staleAccountPolicy.inactive_days_threshold);
    expect(result.savings.estimated_monthly_usd).toBe(staleAccountPolicy.monthly_license_cost_usd);
  });

  it("requires review for stale privileged accounts before cleanup", () => {
    const result = evaluateAccountStaleness(findAccount("aad-u-8812"), staleAccountPolicy, AS_OF_DATE);

    expect(result.status).toBe("review_required");
    expect(result.recommended_action).toBe("manager_review");
    expect(result.reasons.some((reason) => reason.includes("elevated privilege"))).toBe(true);
  });

  it("protects accounts in protected departments from automatic suspension", () => {
    const result = evaluateAccountStaleness(findAccount("gws-shared-hr"), staleAccountPolicy, AS_OF_DATE);

    expect(result.status).toBe("protected_review");
    expect(result.protected_by).toContain("protected department: Human Resources");
    expect(result.reasons.some((reason) => reason.includes("created_at is used"))).toBe(true);
  });

  it("protects accounts in protected groups and break-glass accounts", () => {
    const groupProtected = evaluateAccountStaleness(findAccount("aad-admin-007"), staleAccountPolicy, AS_OF_DATE);
    const breakGlass = evaluateAccountStaleness(findAccount("okta-breakglass-01"), staleAccountPolicy, AS_OF_DATE);

    expect(groupProtected.status).toBe("protected_review");
    expect(groupProtected.protected_by).toContain("protected group: Privileged-Role-Admins");
    expect(breakGlass.status).toBe("protected_review");
    expect(breakGlass.protected_by).toContain("protected break-glass account: okta-breakglass-01");
  });

  it("leaves recently active users active", () => {
    const result = evaluateAccountStaleness(findAccount("aad-u-5510"), staleAccountPolicy, AS_OF_DATE);

    expect(result.status).toBe("active");
    expect(result.savings.estimated_monthly_usd).toBe(0);
  });
});

describe("evaluateStaleAccountCleanup", () => {
  it("summarizes eligible, review, protected, and active records across providers", () => {
    const result = evaluateStaleAccountCleanup(staleAccountCandidates, staleAccountPolicy, AS_OF_DATE);
    const providers = new Set(result.items.map((item) => item.provider));

    expect(providers.has("Okta")).toBe(true);
    expect(providers.has("Google Workspace")).toBe(true);
    expect(result.summary.eligible_for_suspension).toBeGreaterThanOrEqual(1);
    expect(result.summary.review_required).toBeGreaterThanOrEqual(1);
    expect(result.summary.protected_review).toBeGreaterThanOrEqual(1);
    expect(result.summary.active).toBeGreaterThanOrEqual(1);
    expect(result.summary.estimated_annual_savings_usd).toBe(result.summary.estimated_monthly_savings_usd * 12);
  });
});

describe("Slack recommendation and export report", () => {
  it("builds a Slack-style recommendation from cleanup results", () => {
    const result = evaluateStaleAccountCleanup(staleAccountCandidates, staleAccountPolicy, AS_OF_DATE);
    const slack = buildSlackRecommendation(result);

    expect(slack.text).toContain("Stale Account Cleanup");
    expect(slack.text).toContain("Estimated monthly savings");
    expect(slack.highest_risk_accounts.length).toBeGreaterThan(0);
  });

  it("builds deterministic export rows without writing files", () => {
    const result = evaluateStaleAccountCleanup(staleAccountCandidates, staleAccountPolicy, AS_OF_DATE);
    const rows = buildStaleAccountReport(result);

    expect(rows).toHaveLength(staleAccountCandidates.length);
    expect(rows[0]).toHaveProperty("recommended_action");
    expect(rows[0]).toHaveProperty("estimated_annual_savings_usd");
    expect(rows.find((row) => row.account_id === "gws-shared-hr")?.protected_by).toContain("Human Resources");
  });
});

