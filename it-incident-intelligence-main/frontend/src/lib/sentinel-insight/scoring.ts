import type { RiskLevel } from "@/lib/shared/riskLevels";
import { riskScoreToLevel } from "@/lib/shared/riskLevels";
import type { SentinelAlert, SentinelIncident } from "./types";

export function deriveSentinelRiskLevel(
  input: Pick<SentinelAlert | SentinelIncident, "riskScore">
): RiskLevel {
  return riskScoreToLevel(input.riskScore);
}
