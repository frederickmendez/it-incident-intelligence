import { maxRiskLevel } from "@/lib/shared/riskLevels";
import { deriveSentinelRiskLevel } from "./scoring";
import type { DetectionRule, SentinelAlert, SentinelIncident, SentinelInsightAnalysis } from "./types";

export function analyzeSentinelInsight(
  alerts: SentinelAlert[],
  incidents: SentinelIncident[],
  detectionRules: DetectionRule[]
): SentinelInsightAnalysis {
  const activeAlerts = alerts.filter((alert) => alert.status !== "resolved");
  const activeIncidents = incidents.filter(
    (incident) => incident.status !== "resolved"
  );

  const triggeredRuleIds = new Set(activeAlerts.map((alert) => alert.detectionRuleId));

  return {
    summary: {
      activeAlerts: activeAlerts.length,
      criticalIncidents: activeIncidents.filter((incident) => incident.severity === "critical").length,
      averageThreatScore: Math.round(
        activeAlerts.reduce((total, alert) => total + alert.riskScore, 0) /
          activeAlerts.length
      ),
      triggeredDetectionRules: triggeredRuleIds.size,
      activeSecurityIncidents: activeIncidents.length,
      dominantRiskLevel: maxRiskLevel(
        activeAlerts.map((alert) => deriveSentinelRiskLevel(alert))
      ),
    },
    alertTable: activeAlerts.sort(
      (left, right) => right.riskScore - left.riskScore
    ),
    incidentTimeline: buildIncidentTimeline(activeIncidents),
    severityDistribution: buildSeverityDistribution(activeAlerts),
    categoryDistribution: buildCategoryDistribution(activeAlerts),
    statusDistribution: buildStatusDistribution(activeAlerts),
    detectionRules: detectionRules
      .filter((rule) => triggeredRuleIds.has(rule.ruleId))
      .sort((left, right) => Date.parse(right.lastTriggeredAt) - Date.parse(left.lastTriggeredAt)),
    pulseFeed: activeAlerts.slice(0, 5).map(
      (alert) =>
        `${alert.alertId} ${alert.status.toUpperCase()} ${alert.title} on ${alert.affectedAssetName}`
    ),
  };
}

function buildIncidentTimeline(incidents: SentinelIncident[]) {
  const map = new Map<string, number>();

  for (const incident of incidents) {
    const label = new Date(incident.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    map.set(label, (map.get(label) ?? 0) + 1);
  }

  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
}

function buildSeverityDistribution(alerts: SentinelAlert[]) {
  const colors = {
    low: "var(--nexus-blue)",
    medium: "var(--nexus-warning)",
    high: "var(--nexus-purple)",
    critical: "var(--nexus-red)",
  } as const;

  return (["low", "medium", "high", "critical"] as const).map((severity) => ({
    label: severity.toUpperCase(),
    value: alerts.filter((alert) => alert.severity === severity).length,
    color: colors[severity],
  }));
}

function buildCategoryDistribution(alerts: SentinelAlert[]) {
  const colors = [
    "var(--nexus-purple)",
    "var(--nexus-blue)",
    "var(--nexus-warning)",
    "var(--nexus-red)",
    "var(--nexus-green)",
  ];
  const counts = new Map<string, number>();

  for (const alert of alerts) {
    counts.set(alert.category, (counts.get(alert.category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1])
    .map(([label, value], index) => ({
      label,
      value,
      color: colors[index % colors.length],
    }));
}

function buildStatusDistribution(alerts: SentinelAlert[]) {
  const colors = {
    open: "var(--nexus-red)",
    investigating: "var(--nexus-purple)",
    contained: "var(--nexus-warning)",
    resolved: "var(--nexus-green)",
  } as const;

  return (["open", "investigating", "contained", "resolved"] as const).map(
    (status) => ({
      label: status.toUpperCase(),
      value: alerts.filter((alert) => alert.status === status).length,
      color: colors[status],
    })
  );
}
