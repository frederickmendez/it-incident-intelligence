import type { CloudResourceRecord } from "@/lib/cloud-cost/types";
import type {
  MdmActivityLog,
  MdmDeviceRecord,
  MdmNetworkConnection,
} from "@/lib/mdm-security/types";
import type {
  DetectionRule,
  SentinelAlert,
  SentinelIncident,
} from "@/lib/sentinel-insight/types";
import type { SupportTicketRecord } from "@/lib/ticket-classifier/types";
import type { EnvironmentScenario } from "./environment-scenario";

type ScenarioFixtures = {
  cloudResources: CloudResourceRecord[];
  mdmDevices: MdmDeviceRecord[];
  mdmActivityLogs: MdmActivityLog[];
  mdmNetworkConnections: MdmNetworkConnection[];
  supportTickets: SupportTicketRecord[];
  sentinelAlerts: SentinelAlert[];
  sentinelIncidents: SentinelIncident[];
  sentinelDetectionRules: DetectionRule[];
};

export function applyEnvironmentScenario(
  scenario: EnvironmentScenario,
  fixtures: ScenarioFixtures
): ScenarioFixtures {
  if (scenario === "security_stress") {
    return applySecurityStressScenario(fixtures);
  }

  if (scenario === "finops_review") {
    return applyFinopsReviewScenario(fixtures);
  }

  return cloneFixtures(fixtures);
}

function cloneFixtures(fixtures: ScenarioFixtures): ScenarioFixtures {
  return {
    cloudResources: fixtures.cloudResources.map((item) => ({ ...item })),
    mdmDevices: fixtures.mdmDevices.map((item) => ({
      ...item,
      riskReasons: [...item.riskReasons],
    })),
    mdmActivityLogs: fixtures.mdmActivityLogs.map((item) => ({ ...item })),
    mdmNetworkConnections: fixtures.mdmNetworkConnections.map((item) => ({
      ...item,
    })),
    supportTickets: fixtures.supportTickets.map((item) => ({
      ...item,
      keywords: [...item.keywords],
    })),
    sentinelAlerts: fixtures.sentinelAlerts.map((item) => ({
      ...item,
      evidence: [...item.evidence],
    })),
    sentinelIncidents: fixtures.sentinelIncidents.map((item) => ({
      ...item,
      evidence: [...item.evidence],
    })),
    sentinelDetectionRules: fixtures.sentinelDetectionRules.map((item) => ({
      ...item,
    })),
  };
}

function applySecurityStressScenario(
  fixtures: ScenarioFixtures
): ScenarioFixtures {
  const base = cloneFixtures(fixtures);

  return {
    ...base,
    mdmDevices: base.mdmDevices.map((device) => ({
      ...device,
      riskScore: Math.min(99, device.riskScore + 12),
      riskReasons: device.riskReasons.includes("Security stress scenario elevates monitoring posture.")
        ? device.riskReasons
        : [
            ...device.riskReasons,
            "Security stress scenario elevates monitoring posture.",
          ],
      complianceStatus:
        device.complianceStatus === "compliant"
          ? "warning"
          : device.complianceStatus,
    })),
    mdmActivityLogs: base.mdmActivityLogs.map((log, index) => ({
      ...log,
      severity:
        index < 4
          ? "critical"
          : log.severity === "low"
            ? "medium"
            : log.severity,
      isSuspicious: index < 5 ? true : log.isSuspicious,
      description:
        index < 3
          ? `${log.description} Escalated in security stress scenario.`
          : log.description,
    })),
    mdmNetworkConnections: base.mdmNetworkConnections.map((connection, index) => ({
      ...connection,
      riskLevel:
        index < 3 ? "critical" : connection.riskLevel === "low" ? "medium" : connection.riskLevel,
      connectionStatus:
        index < 2 ? "blocked" : connection.connectionStatus,
      reason:
        index < 3
          ? `${connection.reason} Elevated due to stress-scenario containment rules.`
          : connection.reason,
    })),
    supportTickets: base.supportTickets.map((ticket, index) => ({
      ...ticket,
      urgency:
        index < 4
          ? "critical"
          : ticket.urgency === "low"
            ? "medium"
            : ticket.urgency,
      isSecurityRelated: index < 5 ? true : ticket.isSecurityRelated,
      hasCustomerImpact: index < 4 ? true : ticket.hasCustomerImpact,
      affectedUsersCount:
        index < 4 ? ticket.affectedUsersCount + 180 : ticket.affectedUsersCount,
      keywords:
        index < 4 && !ticket.keywords.includes("incident-bridge")
          ? [...ticket.keywords, "incident-bridge"]
          : ticket.keywords,
    })),
    sentinelAlerts: base.sentinelAlerts.map((alert, index) => ({
      ...alert,
      severity:
        index < 3
          ? "critical"
          : alert.severity === "medium"
            ? "high"
            : alert.severity,
      status:
        alert.status === "contained" ? "investigating" : alert.status,
      riskScore: Math.min(99, alert.riskScore + 10),
      confidenceScore: Math.min(99, alert.confidenceScore + 6),
      recommendedAction:
        index < 3
          ? `${alert.recommendedAction} Escalate to incident bridge immediately.`
          : alert.recommendedAction,
    })),
    sentinelIncidents: base.sentinelIncidents.map((incident, index) => ({
      ...incident,
      severity:
        index < 2 || incident.severity === "high"
          ? "critical"
          : incident.severity,
      status:
        incident.status === "contained" ? "investigating" : incident.status,
      riskScore: Math.min(99, incident.riskScore + 9),
    })),
    sentinelDetectionRules: base.sentinelDetectionRules.map((rule, index) => ({
      ...rule,
      lastTriggeredAt:
        index < 4 ? "2026-05-02T21:45:00Z" : rule.lastTriggeredAt,
    })),
  };
}

function applyFinopsReviewScenario(
  fixtures: ScenarioFixtures
): ScenarioFixtures {
  const base = cloneFixtures(fixtures);

  return {
    ...base,
    cloudResources: base.cloudResources.map((resource, index) => ({
      ...resource,
      estimatedMonthlyWasteUsd: round2(
        resource.estimatedMonthlyWasteUsd *
          (resource.estimatedMonthlyWasteUsd > 0
            ? index < 4
              ? 1.55
              : 1.28
            : 1)
      ),
      monthlyCostUsd: round2(
        resource.monthlyCostUsd *
          (resource.estimatedMonthlyWasteUsd > 0 && index < 5 ? 1.18 : 1)
      ),
      status:
        resource.status === "running" && index === 5 ? "idle" : resource.status,
      wasteReason:
        resource.estimatedMonthlyWasteUsd > 0
          ? `${resource.wasteReason} FinOps review scenario increases scrutiny on recoverable spend.`
          : resource.wasteReason,
      recommendedAction:
        resource.estimatedMonthlyWasteUsd > 0
          ? `${resource.recommendedAction} Prioritize in the monthly savings review.`
          : resource.recommendedAction,
    })),
    supportTickets: base.supportTickets.map((ticket, index) => ({
      ...ticket,
      category:
        index < 3 ? "Cloud Operations" : ticket.category,
      affectedService:
        index < 3 ? `Cloud Cost Review - ${ticket.affectedService}` : ticket.affectedService,
      urgency:
        index < 2 ? "high" : ticket.urgency,
      keywords:
        index < 3 && !ticket.keywords.includes("cost-review")
          ? [...ticket.keywords, "cost-review"]
          : ticket.keywords,
    })),
    sentinelAlerts: base.sentinelAlerts.map((alert, index) => ({
      ...alert,
      severity:
        index === 4 && alert.severity === "high" ? "medium" : alert.severity,
      riskScore:
        index === 4 ? Math.max(55, alert.riskScore - 10) : alert.riskScore,
    })),
    mdmDevices: base.mdmDevices.map((device) => ({
      ...device,
      riskScore: Math.max(10, device.riskScore - 4),
    })),
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
