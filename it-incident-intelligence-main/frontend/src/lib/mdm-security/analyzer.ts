import type { ComplianceFleetSummary } from "@/lib/mdm-compliance-checker/types";
import { maxRiskLevel } from "@/lib/shared/riskLevels";
import { calculateDeviceRiskScore, deriveDeviceRiskLevel, isSuspiciousActivity } from "./scoring";
import type { MdmActivityLog, MdmDeviceRecord, MdmNetworkConnection, MdmSecurityAnalysis } from "./types";

export function analyzeMdmSecurity(
  devices: MdmDeviceRecord[],
  activityLogs: MdmActivityLog[],
  networkConnections: MdmNetworkConnection[],
  compliancePosture: ComplianceFleetSummary
): MdmSecurityAnalysis {
  const deviceRiskTable = devices
    .map((device) => ({
      ...device,
      riskScore: calculateDeviceRiskScore(device),
      riskLevel: deriveDeviceRiskLevel(device),
    }))
    .sort((left, right) => right.riskScore - left.riskScore);

  const suspiciousActivity = activityLogs
    .filter(isSuspiciousActivity)
    .sort((left, right) => Date.parse(right.timestamp) - Date.parse(left.timestamp));

  const activeEndpointAlerts = deviceRiskTable.filter(
    (device) => device.riskLevel === "high" || device.riskLevel === "critical"
  ).length;

  return {
    summary: {
      totalManagedDevices: deviceRiskTable.length,
      nonCompliantDevices: deviceRiskTable.filter(
        (device) => device.complianceStatus !== "compliant"
      ).length,
      highRiskDevices: deviceRiskTable.filter(
        (device) => device.riskLevel === "high" || device.riskLevel === "critical"
      ).length,
      suspiciousEvents: suspiciousActivity.length,
      averageRiskScore: Math.round(
        deviceRiskTable.reduce((total, device) => total + device.riskScore, 0) /
          deviceRiskTable.length
      ),
      dominantRiskLevel: maxRiskLevel(deviceRiskTable.map((device) => device.riskLevel)),
      activeEndpointAlerts,
    },
    compliancePosture,
    deviceRiskTable,
    suspiciousActivity,
    userActivityFeed: activityLogs
      .slice()
      .sort((left, right) => Date.parse(right.timestamp) - Date.parse(left.timestamp)),
    networkConnections: networkConnections
      .slice()
      .sort((left, right) => Date.parse(right.timestamp) - Date.parse(left.timestamp)),
    riskDistribution: buildRiskDistribution(deviceRiskTable),
    platformDistribution: buildPlatformDistribution(deviceRiskTable),
    complianceDistribution: buildComplianceDistribution(deviceRiskTable),
  };
}

function buildRiskDistribution(devices: MdmDeviceRecord[]) {
  const colors = {
    low: "var(--nexus-green)",
    medium: "var(--nexus-blue)",
    high: "var(--nexus-warning)",
    critical: "var(--nexus-red)",
  } as const;

  return (["low", "medium", "high", "critical"] as const).map((level) => ({
    label: level.toUpperCase(),
    value: devices.filter((device) => device.riskLevel === level).length,
    color: colors[level],
  }));
}

function buildPlatformDistribution(devices: MdmDeviceRecord[]) {
  const colors = [
    "var(--nexus-green)",
    "var(--nexus-blue)",
    "var(--nexus-warning)",
    "var(--nexus-purple)",
  ];
  const counts = new Map<string, number>();

  for (const device of devices) {
    counts.set(device.platform, (counts.get(device.platform) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([label, value], index) => ({
    label,
    value,
    color: colors[index % colors.length],
  }));
}

function buildComplianceDistribution(devices: MdmDeviceRecord[]) {
  const colors = {
    compliant: "var(--nexus-green)",
    warning: "var(--nexus-warning)",
    non_compliant: "var(--nexus-red)",
  } as const;

  return (["compliant", "warning", "non_compliant"] as const).map((status) => ({
    label: status.replace("_", " ").toUpperCase(),
    value: devices.filter((device) => device.complianceStatus === status).length,
    color: colors[status],
  }));
}
