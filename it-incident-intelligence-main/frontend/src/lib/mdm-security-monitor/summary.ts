import type { ManagedDevice } from "./types";

export type HighRiskDeviceFinding = {
  device_id: string;
  hostname: string;
  reasons: string[];
};

export type MdmSecurityMonitorSummary = {
  summary: {
    total_devices: number;
    high_risk_devices: number;
  };
  items: HighRiskDeviceFinding[];
  calculation_notes: string[];
};

export function summarizeMdmSecurityMonitor(
  devices: ManagedDevice[]
): MdmSecurityMonitorSummary {
  const highRiskItems = devices
    .map((device) => ({
      device_id: device.id,
      hostname: device.hostname,
      reasons: highRiskReasons(device),
    }))
    .filter((item) => item.reasons.length > 0);

  return {
    summary: {
      total_devices: devices.length,
      high_risk_devices: highRiskItems.length,
    },
    items: highRiskItems,
    calculation_notes: [
      `MDM Security Monitor evaluates ${devices.length} mock managed devices for high-risk posture signals.`,
      "A device is high risk when it is unenrolled, jailbroken/rooted, has unknown compliance state, has multiple security signals, or is critical with at least one security signal.",
    ],
  };
}

function highRiskReasons(device: ManagedDevice): string[] {
  const reasons: string[] = [];

  if (device.management_state === "unenrolled") {
    reasons.push(`${device.hostname} is unenrolled from MDM.`);
  }

  if (device.posture.jailbreak_or_root_detected) {
    reasons.push(`${device.hostname} reports jailbreak or root detection.`);
  }

  if (device.security_signals.includes("unknown_compliance_state")) {
    reasons.push(`${device.hostname} has unknown compliance state.`);
  }

  if (device.security_signals.length >= 2) {
    reasons.push(
      `${device.hostname} has ${device.security_signals.length} security posture signals.`
    );
  }

  if (
    device.business_criticality === "critical" &&
    device.security_signals.length > 0
  ) {
    reasons.push(`${device.hostname} is business critical with security drift.`);
  }

  return reasons;
}
