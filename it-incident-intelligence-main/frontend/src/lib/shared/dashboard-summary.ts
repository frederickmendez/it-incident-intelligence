import { cloudCostResources } from "@/data/mock/cloud-cost-auditor/mock";
import { mdmComplianceDevices } from "@/data/mock/mdm-compliance-checker/mock";
import { mdmSecurityDevices } from "@/data/mock/mdm-security-monitor/mock";
import { staleAccountCandidates } from "@/data/mock/stale-account-cleanup/mock";
import { urgentTicketSamples } from "@/data/mock/urgent-ticket-classifier/mock";
import { macOsCompliancePolicy } from "@/data/policies/mdm-compliance-checker/macos-policy";
import { staleAccountPolicy } from "@/data/policies/stale-account-cleanup/stale-account-policy";
import { summarizeCloudCostAuditor } from "@/lib/cloud-cost/summary";
import { summarizeMdmComplianceChecker } from "@/lib/mdm-compliance-checker/summary";
import { summarizeMdmSecurityMonitor } from "@/lib/mdm-security-monitor/summary";
import { summarizeStaleAccountCleanup } from "@/lib/stale-account-cleanup/summary";
import { summarizeUrgentTicketClassifier } from "@/lib/ticket-classifier/summary";

export type ExecutiveDashboardKpi = {
  id:
    | "total-monthly-cloud-waste"
    | "high-risk-devices"
    | "non-compliant-macos-devices"
    | "stale-accounts"
    | "identity-license-savings"
    | "p1-tickets";
  label: string;
  value: string;
  supportingText: string;
  sourceModule: string;
};

export type ExecutiveDashboardSummary = {
  kpis: ExecutiveDashboardKpi[];
  executiveSummary: string;
  calculationNotes: string[];
  sourceModules: string[];
};

export function buildExecutiveDashboardSummary(): ExecutiveDashboardSummary {
  const cloud = summarizeCloudCostAuditor(cloudCostResources);
  const mdmSecurity = summarizeMdmSecurityMonitor(mdmSecurityDevices);
  const mdmCompliance = summarizeMdmComplianceChecker(
    mdmComplianceDevices,
    macOsCompliancePolicy
  );
  const staleAccounts = summarizeStaleAccountCleanup(
    staleAccountCandidates,
    staleAccountPolicy
  );
  const urgentTickets = summarizeUrgentTicketClassifier(urgentTicketSamples);

  const kpis: ExecutiveDashboardKpi[] = [
    {
      id: "total-monthly-cloud-waste",
      label: "Total monthly cloud waste",
      value: formatCurrency(cloud.summary.total_monthly_waste_usd),
      supportingText: `${cloud.summary.waste_resource_count} waste contributors`,
      sourceModule: "Cloud Cost Auditor",
    },
    {
      id: "high-risk-devices",
      label: "High-risk devices",
      value: formatCount(mdmSecurity.summary.high_risk_devices),
      supportingText: `${mdmSecurity.summary.total_devices} devices reviewed`,
      sourceModule: "MDM Security Monitor",
    },
    {
      id: "non-compliant-macos-devices",
      label: "Non-compliant macOS devices",
      value: formatCount(
        mdmCompliance.summary.non_compliant_macos_devices
      ),
      supportingText: `${mdmCompliance.summary.total_devices} compliance records`,
      sourceModule: "MDM Compliance Checker",
    },
    {
      id: "stale-accounts",
      label: "Stale accounts",
      value: formatCount(staleAccounts.summary.stale_accounts),
      supportingText: `${staleAccounts.summary.total_accounts} identities reviewed`,
      sourceModule: "Stale Account Cleanup",
    },
    {
      id: "identity-license-savings",
      label: "Estimated identity license savings",
      value: formatCurrency(
        staleAccounts.summary.estimated_monthly_savings_usd
      ),
      supportingText: "monthly savings estimate",
      sourceModule: "Stale Account Cleanup",
    },
    {
      id: "p1-tickets",
      label: "P1 tickets",
      value: formatCount(urgentTickets.summary.p1_tickets),
      supportingText: `${urgentTickets.summary.total_tickets} tickets classified`,
      sourceModule: "Urgent Ticket Classifier",
    },
  ];

  return {
    kpis,
    executiveSummary: [
      `Nexus is tracking ${formatCurrency(cloud.summary.total_monthly_waste_usd)} in projected monthly cloud waste, ${mdmSecurity.summary.high_risk_devices} high-risk managed devices, and ${mdmCompliance.summary.non_compliant_macos_devices} non-compliant macOS devices.`,
      `Identity cleanup has ${staleAccounts.summary.stale_accounts} stale accounts with ${formatCurrency(staleAccounts.summary.estimated_monthly_savings_usd)} in estimated monthly license savings, while operations has ${urgentTickets.summary.p1_tickets} active P1-classified tickets to watch.`,
    ].join(" "),
    calculationNotes: [
      ...cloud.calculation_notes,
      ...mdmSecurity.calculation_notes,
      ...mdmCompliance.calculation_notes,
      ...staleAccounts.calculation_notes,
      ...urgentTickets.calculation_notes,
    ],
    sourceModules: [
      "Cloud Cost Auditor",
      "MDM Security Monitor",
      "MDM Compliance Checker",
      "Stale Account Cleanup",
      "Urgent Ticket Classifier",
    ],
  };
}

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  });
}

function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}
