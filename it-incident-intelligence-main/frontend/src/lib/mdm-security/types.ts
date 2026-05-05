import type { RiskLevel } from "@/lib/shared/riskLevels";
import type { ComplianceFleetSummary } from "@/lib/mdm-compliance-checker/types";

export type AntivirusStatus = "healthy" | "degraded" | "missing" | "unknown";
export type ComplianceStatus = "compliant" | "warning" | "non_compliant";
export type LogSeverity = "low" | "medium" | "high" | "critical";
export type ConnectionStatus = "allowed" | "observed" | "stale" | "blocked";

export type MdmDeviceRecord = {
  deviceId: string;
  deviceName: string;
  serialNumber: string;
  assignedUser: string;
  department: string;
  location: string;
  platform: string;
  osVersion: string;
  model: string;
  complianceStatus: ComplianceStatus;
  encryptionEnabled: boolean;
  firewallEnabled: boolean;
  screenLockEnabled: boolean;
  antivirusStatus: AntivirusStatus;
  lastCheckInAt: string;
  riskScore: number;
  riskLevel: RiskLevel;
  riskReasons: string[];
};

export type MdmActivityLog = {
  logId: string;
  deviceId: string;
  userId: string;
  timestamp: string;
  eventType: string;
  severity: LogSeverity;
  sourceIp: string;
  geoLocation: string;
  description: string;
  isSuspicious: boolean;
  detectionRule: string;
};

export type MdmNetworkConnection = {
  connectionId: string;
  deviceId: string;
  userId: string;
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  destinationHost: string;
  destinationPort: number;
  protocol: string;
  networkZone: string;
  bytesSent: number;
  bytesReceived: number;
  connectionStatus: ConnectionStatus;
  riskLevel: RiskLevel;
  reason: string;
};

export type MdmSecurityAnalysis = {
  summary: {
    totalManagedDevices: number;
    nonCompliantDevices: number;
    highRiskDevices: number;
    suspiciousEvents: number;
    averageRiskScore: number;
    dominantRiskLevel: RiskLevel;
    activeEndpointAlerts: number;
  };
  compliancePosture: ComplianceFleetSummary;
  deviceRiskTable: MdmDeviceRecord[];
  suspiciousActivity: MdmActivityLog[];
  userActivityFeed: MdmActivityLog[];
  networkConnections: MdmNetworkConnection[];
  riskDistribution: {
    label: string;
    value: number;
    color: string;
  }[];
  platformDistribution: {
    label: string;
    value: number;
    color: string;
  }[];
  complianceDistribution: {
    label: string;
    value: number;
    color: string;
  }[];
};
