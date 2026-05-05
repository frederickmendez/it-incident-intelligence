import type { RiskLevel } from "@/lib/shared/riskLevels";
import { riskScoreToLevel } from "@/lib/shared/riskLevels";
import type { MdmActivityLog, MdmDeviceRecord } from "./types";

export function calculateDeviceRiskScore(device: MdmDeviceRecord): number {
  let score = device.riskScore;

  if (!device.encryptionEnabled) score += 12;
  if (!device.firewallEnabled) score += 8;
  if (!device.screenLockEnabled) score += 8;
  if (device.antivirusStatus === "missing") score += 14;
  if (device.antivirusStatus === "unknown") score += 10;
  if (device.complianceStatus === "non_compliant") score += 12;
  if (hoursSince(device.lastCheckInAt) > 72) score += 10;

  return Math.min(99, Math.round(score));
}

export function deriveDeviceRiskLevel(device: MdmDeviceRecord): RiskLevel {
  return riskScoreToLevel(calculateDeviceRiskScore(device));
}

export function isSuspiciousActivity(log: MdmActivityLog): boolean {
  return log.isSuspicious || log.severity === "high" || log.severity === "critical";
}

function hoursSince(value: string): number {
  return Math.max(0, (Date.now() - new Date(value).getTime()) / (1000 * 60 * 60));
}
