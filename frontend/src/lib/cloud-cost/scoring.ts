import type { RiskLevel } from "@/lib/shared/riskLevels";
import { riskScoreToLevel } from "@/lib/shared/riskLevels";
import type { CloudResourceRecord } from "./types";

export function calculateCloudWasteRiskScore(
  resource: CloudResourceRecord
): number {
  let score = 0;

  score += Math.min(45, resource.estimatedMonthlyWasteUsd / 8);

  if (resource.status === "unattached") score += 22;
  if (resource.status === "orphaned") score += 20;
  if (resource.status === "idle") score += 18;
  if (resource.environment === "production") score += 12;
  if (resource.cpuUtilizationPercent <= 2) score += 8;

  return Math.min(99, Math.round(score));
}

export function deriveCloudWasteRiskLevel(
  resource: CloudResourceRecord
): RiskLevel {
  return riskScoreToLevel(calculateCloudWasteRiskScore(resource));
}
