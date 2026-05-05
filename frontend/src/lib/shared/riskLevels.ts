export type RiskLevel = "low" | "medium" | "high" | "critical";

const RISK_ORDER: Record<RiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function maxRiskLevel(levels: RiskLevel[]): RiskLevel {
  return levels.reduce<RiskLevel>(
    (current, level) =>
      RISK_ORDER[level] > RISK_ORDER[current] ? level : current,
    "low"
  );
}

export function riskScoreToLevel(score: number): RiskLevel {
  if (score >= 85) return "critical";
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  return "low";
}

export function levelToPercent(level: RiskLevel): number {
  if (level === "critical") return 95;
  if (level === "high") return 78;
  if (level === "medium") return 52;
  return 24;
}
