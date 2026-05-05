export type CompliancePlatform = "macos" | "windows" | "ios" | "android";

export type ComplianceStatus = "compliant" | "warning" | "non_compliant";

export type ComplianceCheckId =
  | "filevault_enabled"
  | "firewall_enabled"
  | "os_version_minimum"
  | "screen_lock_required"
  | "endpoint_protection_required"
  | "automatic_updates_enabled"
  | "icloud_private_relay_disabled"
  | "gatekeeper_enabled";

export type ComplianceControlEvidence = {
  check_id: ComplianceCheckId;
  observed_value: string | number | boolean | null;
  collected_at: string;
};

export type ComplianceDeviceRecord = {
  device_id: string;
  hostname: string;
  platform: CompliancePlatform;
  os_version: string;
  assigned_user_email: string;
  department: string;
  business_unit: string;
  last_checkin_at: string;
  evidence: ComplianceControlEvidence[];
};

export type MacOsCompliancePolicy = {
  id: string;
  name: string;
  platform: "macos";
  minimum_os_version: string;
  required_checks: {
    filevault_enabled: boolean;
    firewall_enabled: boolean;
    screen_lock_required: boolean;
    endpoint_protection_required: boolean;
    automatic_updates_enabled: boolean;
    gatekeeper_enabled: boolean;
    icloud_private_relay_disabled: boolean;
  };
  grace_period_days: number;
  policy_owner: string;
};

export type NormalizedVersion = {
  raw: string;
  major: number;
  minor: number;
  patch: number;
  normalized: string;
};

export type VersionParseResult =
  | {
      ok: true;
      version: NormalizedVersion;
    }
  | {
      ok: false;
      raw: string | null;
      reason: string;
    };

export type VersionComparisonResult = -1 | 0 | 1;

export type ComplianceRuleHit = {
  rule_id: string;
  check_id: ComplianceCheckId | "platform_scope";
  status: ComplianceStatus;
  expected_value: string | number | boolean | null;
  observed_value: string | number | boolean | null;
  reason: string;
};

export type ComplianceCheckResult = {
  check_id: ComplianceCheckId | "platform_scope";
  status: ComplianceStatus;
  expected_value: string | number | boolean | null;
  observed_value: string | number | boolean | null;
  collected_at: string | null;
  reason: string;
};

export type ComplianceDeviceResult = {
  device_id: string;
  hostname: string;
  platform: CompliancePlatform;
  policy_id: string;
  status: ComplianceStatus;
  reasons: string[];
  rule_hits: ComplianceRuleHit[];
  check_results: ComplianceCheckResult[];
};

export type ComplianceFleetSummary = {
  total_devices: number;
  compliant: number;
  warning: number;
  non_compliant: number;
};

export type ComplianceFleetResult = {
  policy_id: string;
  policy_name: string;
  summary: ComplianceFleetSummary;
  items: ComplianceDeviceResult[];
};
