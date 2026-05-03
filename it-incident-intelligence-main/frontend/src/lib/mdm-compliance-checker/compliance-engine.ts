import type {
  ComplianceCheckId,
  ComplianceCheckResult,
  ComplianceControlEvidence,
  ComplianceDeviceRecord,
  ComplianceDeviceResult,
  ComplianceFleetResult,
  ComplianceRuleHit,
  ComplianceStatus,
  MacOsCompliancePolicy,
} from "./types";
import { compareVersions, parseOsVersion } from "./version-utils";

const CHECK_LABELS: Record<ComplianceCheckId, string> = {
  filevault_enabled: "FileVault encryption",
  firewall_enabled: "Firewall",
  os_version_minimum: "Operating system version",
  screen_lock_required: "Screen lock",
  endpoint_protection_required: "Endpoint protection",
  automatic_updates_enabled: "Automatic updates",
  icloud_private_relay_disabled: "iCloud Private Relay disabled",
  gatekeeper_enabled: "Gatekeeper",
};

type RequiredBooleanCheck = Exclude<ComplianceCheckId, "os_version_minimum">;

const BOOLEAN_CHECKS: RequiredBooleanCheck[] = [
  "filevault_enabled",
  "firewall_enabled",
  "screen_lock_required",
  "endpoint_protection_required",
  "automatic_updates_enabled",
  "gatekeeper_enabled",
  "icloud_private_relay_disabled",
];

export function evaluateDeviceCompliance(
  device: ComplianceDeviceRecord,
  policy: MacOsCompliancePolicy
): ComplianceDeviceResult {
  if (device.platform !== policy.platform) {
    const reason = `Policy "${policy.name}" applies to macOS devices only; ${device.platform} requires a platform-specific policy.`;
    return {
      device_id: device.device_id,
      hostname: device.hostname,
      platform: device.platform,
      policy_id: policy.id,
      status: "warning",
      reasons: [reason],
      rule_hits: [
        {
          rule_id: `${policy.id}:platform_scope`,
          check_id: "platform_scope",
          status: "warning",
          expected_value: policy.platform,
          observed_value: device.platform,
          reason,
        },
      ],
      check_results: [
        {
          check_id: "platform_scope",
          status: "warning",
          expected_value: policy.platform,
          observed_value: device.platform,
          collected_at: device.last_checkin_at,
          reason,
        },
      ],
    };
  }

  const checkResults = [
    evaluateOsVersion(device, policy),
    ...BOOLEAN_CHECKS.filter((checkId) => policy.required_checks[checkId]).map((checkId) =>
      evaluateBooleanCheck(device, policy, checkId)
    ),
  ];

  const status = aggregateStatus(checkResults.map((result) => result.status));
  const reasons = checkResults
    .filter((result) => result.status !== "compliant")
    .map((result) => result.reason);
  const ruleHits = checkResults.map((result): ComplianceRuleHit => ({
    rule_id: `${policy.id}:${result.check_id}`,
    check_id: result.check_id,
    status: result.status,
    expected_value: result.expected_value,
    observed_value: result.observed_value,
    reason: result.reason,
  }));

  return {
    device_id: device.device_id,
    hostname: device.hostname,
    platform: device.platform,
    policy_id: policy.id,
    status,
    reasons: reasons.length > 0 ? reasons : [`${device.hostname} satisfies all required macOS compliance checks.`],
    rule_hits: ruleHits,
    check_results: checkResults,
  };
}

export function evaluateComplianceFleet(
  devices: ComplianceDeviceRecord[],
  policy: MacOsCompliancePolicy
): ComplianceFleetResult {
  const items = devices.map((device) => evaluateDeviceCompliance(device, policy));

  return {
    policy_id: policy.id,
    policy_name: policy.name,
    summary: {
      total_devices: items.length,
      compliant: items.filter((item) => item.status === "compliant").length,
      warning: items.filter((item) => item.status === "warning").length,
      non_compliant: items.filter((item) => item.status === "non_compliant").length,
    },
    items,
  };
}

function evaluateOsVersion(
  device: ComplianceDeviceRecord,
  policy: MacOsCompliancePolicy
): ComplianceCheckResult {
  const evidence = findEvidence(device.evidence, "os_version_minimum");
  const observedVersion = typeof evidence?.observed_value === "string" ? evidence.observed_value : device.os_version;
  const observedParse = parseOsVersion(observedVersion);
  const policyParse = parseOsVersion(policy.minimum_os_version);

  if (!policyParse.ok) {
    return {
      check_id: "os_version_minimum",
      status: "warning",
      expected_value: policy.minimum_os_version,
      observed_value: observedVersion,
      collected_at: evidence?.collected_at ?? device.last_checkin_at,
      reason: `Policy minimum OS version could not be parsed: ${policyParse.reason}`,
    };
  }

  if (!observedParse.ok) {
    return {
      check_id: "os_version_minimum",
      status: "warning",
      expected_value: policyParse.version.normalized,
      observed_value: observedVersion ?? null,
      collected_at: evidence?.collected_at ?? device.last_checkin_at,
      reason: `${device.hostname} requires manual review because ${observedParse.reason}`,
    };
  }

  const comparison = compareVersions(observedParse.version, policyParse.version);
  if (!comparison.ok) {
    return {
      check_id: "os_version_minimum",
      status: "warning",
      expected_value: policyParse.version.normalized,
      observed_value: observedParse.version.normalized,
      collected_at: evidence?.collected_at ?? device.last_checkin_at,
      reason: `${device.hostname} requires manual review because version comparison failed: ${comparison.reason}`,
    };
  }

  if (comparison.result < 0) {
    return {
      check_id: "os_version_minimum",
      status: "non_compliant",
      expected_value: policyParse.version.normalized,
      observed_value: observedParse.version.normalized,
      collected_at: evidence?.collected_at ?? device.last_checkin_at,
      reason: `${device.hostname} runs macOS ${observedParse.version.normalized}, below required ${policyParse.version.normalized}.`,
    };
  }

  return {
    check_id: "os_version_minimum",
    status: "compliant",
    expected_value: policyParse.version.normalized,
    observed_value: observedParse.version.normalized,
    collected_at: evidence?.collected_at ?? device.last_checkin_at,
    reason: `${device.hostname} runs macOS ${observedParse.version.normalized}, meeting required ${policyParse.version.normalized}.`,
  };
}

function evaluateBooleanCheck(
  device: ComplianceDeviceRecord,
  policy: MacOsCompliancePolicy,
  checkId: RequiredBooleanCheck
): ComplianceCheckResult {
  const evidence = findEvidence(device.evidence, checkId);
  const expectedValue = policy.required_checks[checkId];
  const label = CHECK_LABELS[checkId];

  if (!evidence || evidence.observed_value == null) {
    return {
      check_id: checkId,
      status: "warning",
      expected_value: expectedValue,
      observed_value: evidence?.observed_value ?? null,
      collected_at: evidence?.collected_at ?? null,
      reason: `${device.hostname} is missing evidence for required check: ${label}.`,
    };
  }

  if (typeof evidence.observed_value !== "boolean") {
    return {
      check_id: checkId,
      status: "warning",
      expected_value: expectedValue,
      observed_value: String(evidence.observed_value),
      collected_at: evidence.collected_at,
      reason: `${device.hostname} reported non-boolean evidence for ${label}.`,
    };
  }

  if (evidence.observed_value !== expectedValue) {
    return {
      check_id: checkId,
      status: "non_compliant",
      expected_value: expectedValue,
      observed_value: evidence.observed_value,
      collected_at: evidence.collected_at,
      reason: `${device.hostname} fails ${label}: expected ${expectedValue}, observed ${evidence.observed_value}.`,
    };
  }

  return {
    check_id: checkId,
    status: "compliant",
    expected_value: expectedValue,
    observed_value: evidence.observed_value,
    collected_at: evidence.collected_at,
    reason: `${device.hostname} passes ${label}.`,
  };
}

function findEvidence(
  evidence: ComplianceControlEvidence[],
  checkId: ComplianceCheckId
): ComplianceControlEvidence | undefined {
  return evidence.find((item) => item.check_id === checkId);
}

function aggregateStatus(statuses: ComplianceStatus[]): ComplianceStatus {
  if (statuses.includes("non_compliant")) return "non_compliant";
  if (statuses.includes("warning")) return "warning";
  return "compliant";
}

