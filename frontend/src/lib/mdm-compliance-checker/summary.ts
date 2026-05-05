import type {
  ComplianceDeviceRecord,
  MacOsCompliancePolicy,
} from "./types";
import { evaluateComplianceFleet } from "./compliance-engine";

export type MdmComplianceCheckerSummary = {
  summary: {
    total_devices: number;
    non_compliant_macos_devices: number;
  };
  calculation_notes: string[];
};

export function summarizeMdmComplianceChecker(
  devices: ComplianceDeviceRecord[],
  policy: MacOsCompliancePolicy
): MdmComplianceCheckerSummary {
  const result = evaluateComplianceFleet(devices, policy);

  return {
    summary: {
      total_devices: result.summary.total_devices,
      non_compliant_macos_devices: result.summary.non_compliant,
    },
    calculation_notes: [
      `MDM Compliance Checker uses ${result.policy_name} to evaluate ${result.summary.total_devices} mock device records.`,
      `${result.summary.non_compliant} devices are non-compliant with required macOS checks.`,
    ],
  };
}
