import cloudResourcesData from "@/data/mock/cloud-resources.json";
import mdmActivityLogsData from "@/data/mock/mdm-activity-logs.json";
import mdmDevicesData from "@/data/mock/mdm-devices.json";
import mdmNetworkConnectionsData from "@/data/mock/mdm-network-connections.json";
import sentinelAlertsData from "@/data/mock/sentinel-alerts.json";
import sentinelDetectionRulesData from "@/data/mock/sentinel-detection-rules.json";
import sentinelIncidentsData from "@/data/mock/sentinel-incidents.json";
import supportTicketsData from "@/data/mock/support-tickets.json";
import { mdmComplianceDevices } from "@/data/mock/mdm-compliance-checker/mock";
import { staleAccountCandidates } from "@/data/mock/stale-account-cleanup/mock";
import { macOsCompliancePolicy } from "@/data/policies/mdm-compliance-checker/macos-policy";
import { staleAccountPolicy } from "@/data/policies/stale-account-cleanup/stale-account-policy";
import { analyzeCloudCost } from "@/lib/cloud-cost/analyzer";
import type { CloudResourceRecord } from "@/lib/cloud-cost/types";
import { evaluateComplianceFleet } from "@/lib/mdm-compliance-checker/compliance-engine";
import { analyzeMdmSecurity } from "@/lib/mdm-security/analyzer";
import type { MdmActivityLog, MdmDeviceRecord, MdmNetworkConnection } from "@/lib/mdm-security/types";
import { analyzeSentinelInsight } from "@/lib/sentinel-insight/analyzer";
import type { DetectionRule, SentinelAlert, SentinelIncident } from "@/lib/sentinel-insight/types";
import { summarizeStaleAccountCleanup } from "@/lib/stale-account-cleanup/summary";
import { classifySupportTickets } from "@/lib/ticket-classifier/classifier";
import type { SupportTicketRecord } from "@/lib/ticket-classifier/types";
import { formatCurrency } from "./formatCurrency";
import {
  type EnvironmentScenario,
  type EnvironmentScenarioMeta,
  getEnvironmentScenarioMeta,
} from "./environment-scenario";
import type { RiskLevel } from "./riskLevels";
import { levelToPercent, maxRiskLevel } from "./riskLevels";
import { applyEnvironmentScenario } from "./scenario-fixtures";

export type ModuleHealthItem = {
  key: string;
  label: string;
  status: "healthy" | "warning" | "critical" | "offline";
  summary: string;
};

export type DashboardSummary = {
  scenario: EnvironmentScenarioMeta;
  globalRiskScore: number;
  globalRiskLevel: RiskLevel;
  totalMonthlyCloudWaste: number;
  highRiskManagedDevices: number;
  p1P2UrgentTickets: number;
  activeSecurityIncidents: number;
  p1P2UrgentTicketRiskLevel: RiskLevel;
  staleAccountRiskLevel: RiskLevel;
  executiveSummary: string;
  threatLevelChart: { label: string; value: number }[];
  securityPulseFeed: string[];
  statusNodes: {
    id: string;
    label: string;
    status: "healthy" | "warning" | "critical" | "offline";
  }[];
  attentionItems: {
    title: string;
    detail: string;
    module: string;
    accent: "green" | "blue" | "orange" | "purple" | "red" | "gold";
  }[];
  topActions: {
    title: string;
    detail: string;
    module: string;
  }[];
  moduleSnapshots: {
    key: string;
    label: string;
    metric: string;
    detail: string;
    accent: "green" | "blue" | "orange" | "purple" | "red" | "gold";
  }[];
  moduleHealth: ModuleHealthItem[];
  cloud: ReturnType<typeof analyzeCloudCost>;
  mdm: ReturnType<typeof analyzeMdmSecurity>;
  tickets: ReturnType<typeof classifySupportTickets>;
  sentinel: ReturnType<typeof analyzeSentinelInsight>;
  compliance: ReturnType<typeof evaluateComplianceFleet>;
  staleAccounts: ReturnType<typeof summarizeStaleAccountCleanup>;
};

export function getDashboardSummary(
  scenario: EnvironmentScenario = "enterprise"
): DashboardSummary {
  const scenarioMeta = getEnvironmentScenarioMeta(scenario);
  const scopedFixtures = applyEnvironmentScenario(scenario, {
    cloudResources: cloudResourcesData as CloudResourceRecord[],
    mdmDevices: mdmDevicesData as MdmDeviceRecord[],
    mdmActivityLogs: mdmActivityLogsData as MdmActivityLog[],
    mdmNetworkConnections: mdmNetworkConnectionsData as MdmNetworkConnection[],
    supportTickets: supportTicketsData as SupportTicketRecord[],
    sentinelAlerts: sentinelAlertsData as SentinelAlert[],
    sentinelIncidents: sentinelIncidentsData as SentinelIncident[],
    sentinelDetectionRules: sentinelDetectionRulesData as DetectionRule[],
  });

  const cloud = analyzeCloudCost(scopedFixtures.cloudResources);
  const compliance = evaluateComplianceFleet(
    mdmComplianceDevices,
    macOsCompliancePolicy
  );
  const mdm = analyzeMdmSecurity(
    scopedFixtures.mdmDevices,
    scopedFixtures.mdmActivityLogs,
    scopedFixtures.mdmNetworkConnections,
    compliance.summary
  );
  const tickets = classifySupportTickets(scopedFixtures.supportTickets);
  const sentinel = analyzeSentinelInsight(
    scopedFixtures.sentinelAlerts,
    scopedFixtures.sentinelIncidents,
    scopedFixtures.sentinelDetectionRules
  );
  const staleAccounts = summarizeStaleAccountCleanup(
    staleAccountCandidates,
    staleAccountPolicy
  );

  const globalRiskLevel = maxRiskLevel([
    cloud.summary.dominantRiskLevel,
    mdm.summary.dominantRiskLevel,
    tickets.summary.p1P2Tickets >= 3 ? "high" : tickets.summary.p1P2Tickets >= 1 ? "medium" : "low",
    sentinel.summary.dominantRiskLevel,
    staleAccounts.summary.stale_accounts >= 5 ? "medium" : "low",
  ]);

  const globalRiskScore = Math.round(
    (
      levelToPercent(globalRiskLevel) +
      cloud.summary.totalMonthlyWasteUsd / 20 +
      mdm.summary.averageRiskScore +
      sentinel.summary.averageThreatScore
    ) / 4
  );

  const moduleHealth = buildModuleHealth(cloud, mdm, tickets, sentinel, compliance, staleAccounts);
  const staleAccountRiskLevel: RiskLevel =
    staleAccounts.summary.stale_accounts >= 5 ? "medium" : "low";

  return {
    scenario: scenarioMeta,
    globalRiskScore,
    globalRiskLevel,
    totalMonthlyCloudWaste: cloud.summary.totalMonthlyWasteUsd,
    highRiskManagedDevices: mdm.summary.highRiskDevices,
    p1P2UrgentTickets: tickets.summary.p1P2Tickets,
    activeSecurityIncidents: sentinel.summary.activeSecurityIncidents,
    p1P2UrgentTicketRiskLevel: tickets.summary.p1P2RiskLevel,
    staleAccountRiskLevel,
    executiveSummary: buildExecutiveSummary(
      scenarioMeta,
      cloud,
      mdm,
      tickets,
      sentinel,
      compliance,
      staleAccounts
    ),
    threatLevelChart: sentinel.incidentTimeline,
    securityPulseFeed: [
      ...sentinel.pulseFeed,
      ...mdm.suspiciousActivity.slice(0, 3).map(
        (log) => `${log.logId} ${log.severity.toUpperCase()} ${log.description}`
      ),
    ].slice(0, 6),
    statusNodes: moduleHealth.map((item) => ({
      id: item.key,
      label: item.label,
      status: item.status,
    })),
    attentionItems: buildAttentionItems(
      scenarioMeta,
      cloud,
      mdm,
      tickets,
      sentinel
    ),
    topActions: buildTopActions(cloud, mdm, tickets, sentinel),
    moduleSnapshots: buildModuleSnapshots(
      cloud,
      mdm,
      tickets,
      sentinel,
      staleAccounts
    ),
    moduleHealth,
    cloud,
    mdm,
    tickets,
    sentinel,
    compliance,
    staleAccounts,
  };
}

function buildModuleHealth(
  cloud: ReturnType<typeof analyzeCloudCost>,
  mdm: ReturnType<typeof analyzeMdmSecurity>,
  tickets: ReturnType<typeof classifySupportTickets>,
  sentinel: ReturnType<typeof analyzeSentinelInsight>,
  compliance: ReturnType<typeof evaluateComplianceFleet>,
  staleAccounts: ReturnType<typeof summarizeStaleAccountCleanup>
): ModuleHealthItem[] {
  return [
    {
      key: "cloud-cost",
      label: "Cloud Cost",
      status:
        cloud.summary.totalMonthlyWasteUsd > 600
          ? "critical"
          : cloud.summary.totalMonthlyWasteUsd > 250
            ? "warning"
            : "healthy",
      summary: `${cloud.summary.optimizationCandidates} optimization candidates`,
    },
    {
      key: "mdm-security",
      label: "MDM Security",
      status:
        mdm.summary.highRiskDevices >= 3
          ? "critical"
          : mdm.summary.highRiskDevices >= 1
            ? "warning"
            : "healthy",
      summary: `${mdm.summary.highRiskDevices} high-risk devices`,
    },
    {
      key: "ticket-classifier",
      label: "Ticket Classifier",
      status:
        tickets.summary.p1P2Tickets >= 4
          ? "critical"
          : tickets.summary.p1P2Tickets >= 2
            ? "warning"
            : "healthy",
      summary: `${tickets.summary.p1P2Tickets} P1/P2 tickets`,
    },
    {
      key: "sentinel-insight",
      label: "Sentinel Insight",
      status:
        sentinel.summary.criticalIncidents >= 2
          ? "critical"
          : sentinel.summary.activeAlerts >= 3
            ? "warning"
            : "healthy",
      summary: `${sentinel.summary.activeAlerts} active alerts`,
    },
    {
      key: "mdm-compliance",
      label: "MDM Compliance",
      status:
        compliance.summary.non_compliant >= 2
          ? "critical"
          : compliance.summary.warning >= 1
            ? "warning"
            : "healthy",
      summary: `${compliance.summary.non_compliant} non-compliant devices`,
    },
    {
      key: "identity-cleanup",
      label: "Identity Cleanup",
      status:
        staleAccounts.summary.stale_accounts >= 5
          ? "warning"
          : "healthy",
      summary: `${staleAccounts.summary.stale_accounts} stale accounts`,
    },
  ];
}

function buildExecutiveSummary(
  scenario: EnvironmentScenarioMeta,
  cloud: ReturnType<typeof analyzeCloudCost>,
  mdm: ReturnType<typeof analyzeMdmSecurity>,
  tickets: ReturnType<typeof classifySupportTickets>,
  sentinel: ReturnType<typeof analyzeSentinelInsight>,
  compliance: ReturnType<typeof evaluateComplianceFleet>,
  staleAccounts: ReturnType<typeof summarizeStaleAccountCleanup>
): string {
  return `${scenario.label} is active. NexusOps is currently tracking ${formatCurrency(
    cloud.summary.totalMonthlyWasteUsd
  )} in monthly cloud waste, ${mdm.summary.highRiskDevices} high-risk managed devices, ${tickets.summary.p1P2Tickets} urgent P1/P2 tickets, and ${sentinel.summary.activeSecurityIncidents} active security incidents. Compliance and identity hygiene remain material contributors through ${compliance.summary.non_compliant} non-compliant macOS devices and ${staleAccounts.summary.stale_accounts} stale accounts pending action.`;
}

function buildAttentionItems(
  scenario: EnvironmentScenarioMeta,
  cloud: ReturnType<typeof analyzeCloudCost>,
  mdm: ReturnType<typeof analyzeMdmSecurity>,
  tickets: ReturnType<typeof classifySupportTickets>,
  sentinel: ReturnType<typeof analyzeSentinelInsight>
) {
  return [
    {
      title: "Scenario Focus",
      detail: scenario.subtitle,
      module: "Global",
      accent: scenario.accent,
    },
    {
      title: "Highest Cost Pressure",
      detail: `${cloud.summary.optimizationCandidates} optimization candidates with ${formatCurrency(cloud.summary.highestCostWasteUsd)} as the top single waste item.`,
      module: "Cloud Cost",
      accent: "blue" as const,
    },
    {
      title: "Endpoint Pressure",
      detail: `${mdm.summary.highRiskDevices} high-risk devices and ${mdm.summary.suspiciousEvents} suspicious events need analyst review.`,
      module: "MDM Security",
      accent: "orange" as const,
    },
    {
      title: "Urgent Operations Queue",
      detail: `${tickets.summary.p1P2Tickets} tickets are already in the urgent band with ${tickets.summary.slaBreachRisk} under SLA stress.`,
      module: "Ticket Classifier",
      accent: "purple" as const,
    },
    {
      title: "Security Incident Load",
      detail: `${sentinel.summary.activeAlerts} active alerts and ${sentinel.summary.criticalIncidents} critical incidents remain in play.`,
      module: "Sentinel Insight",
      accent: "red" as const,
    },
  ];
}

function buildTopActions(
  cloud: ReturnType<typeof analyzeCloudCost>,
  mdm: ReturnType<typeof analyzeMdmSecurity>,
  tickets: ReturnType<typeof classifySupportTickets>,
  sentinel: ReturnType<typeof analyzeSentinelInsight>
) {
  return [
    {
      title: "Recover cloud waste",
      detail:
        cloud.recommendedActions[0] ??
        "Review cloud optimization candidates in the current scenario.",
      module: "Cloud Cost",
    },
    {
      title: "Stabilize top endpoint risk",
      detail:
        mdm.deviceRiskTable[0]?.riskReasons[0] ??
        "Review the highest-risk device in the fleet.",
      module: "MDM Security",
    },
    {
      title: "Escalate urgent support queue",
      detail:
        tickets.items[0]?.recommendedAction ??
        "Route the most urgent ticket for same-shift action.",
      module: "Ticket Classifier",
    },
    {
      title: "Advance current incident response",
      detail:
        sentinel.alertTable[0]?.recommendedAction ??
        "Validate the highest-severity active alert.",
      module: "Sentinel Insight",
    },
  ];
}

function buildModuleSnapshots(
  cloud: ReturnType<typeof analyzeCloudCost>,
  mdm: ReturnType<typeof analyzeMdmSecurity>,
  tickets: ReturnType<typeof classifySupportTickets>,
  sentinel: ReturnType<typeof analyzeSentinelInsight>,
  staleAccounts: ReturnType<typeof summarizeStaleAccountCleanup>
) {
  return [
    {
      key: "cloud",
      label: "Cloud Cost",
      metric: formatCurrency(cloud.summary.totalMonthlyWasteUsd),
      detail: `${cloud.summary.optimizationCandidates} recoverable savings candidates`,
      accent: "blue" as const,
    },
    {
      key: "mdm",
      label: "MDM Security",
      metric: `${mdm.summary.highRiskDevices} devices`,
      detail: `${mdm.summary.suspiciousEvents} suspicious events flagged`,
      accent: "orange" as const,
    },
    {
      key: "tickets",
      label: "Ticket Classifier",
      metric: `${tickets.summary.p1P2Tickets} urgent`,
      detail: `${tickets.summary.openTickets} open tickets in queue`,
      accent: "purple" as const,
    },
    {
      key: "sentinel",
      label: "Sentinel Insight",
      metric: `${sentinel.summary.activeSecurityIncidents} incidents`,
      detail: `${sentinel.summary.triggeredDetectionRules} detection rules triggered`,
      accent: "red" as const,
    },
    {
      key: "identity",
      label: "Identity Cleanup",
      metric: formatCurrency(
        staleAccounts.summary.estimated_monthly_savings_usd
      ),
      detail: `${staleAccounts.summary.stale_accounts} stale accounts pending review`,
      accent: "gold" as const,
    },
  ];
}
