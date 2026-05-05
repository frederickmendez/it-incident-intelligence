import type { MacOsCompliancePolicy } from "../../../lib/mdm-compliance-checker/types";

export const macOsCompliancePolicy = {
  id: "policy-macos-enterprise-baseline-2026",
  name: "macOS Enterprise Security Baseline",
  platform: "macos",
  minimum_os_version: "14.4.0",
  required_checks: {
    filevault_enabled: true,
    firewall_enabled: true,
    screen_lock_required: true,
    endpoint_protection_required: true,
    automatic_updates_enabled: true,
    gatekeeper_enabled: true,
    icloud_private_relay_disabled: true,
  },
  grace_period_days: 7,
  policy_owner: "endpoint-security@northwind.example",
} satisfies MacOsCompliancePolicy;

