import type { RiskLevel } from "@/lib/shared/riskLevels";

export type SentinelSeverity = "low" | "medium" | "high" | "critical";
export type SentinelStatus = "open" | "investigating" | "contained" | "resolved";

export type SentinelAlert = {
  alertId: string;
  title: string;
  description: string;
  timestamp: string;
  sourceSystem: string;
  severity: SentinelSeverity;
  status: SentinelStatus;
  category: string;
  affectedAssetId: string;
  affectedAssetName: string;
  affectedUser: string;
  sourceIp: string;
  destinationIp: string;
  destinationHost: string;
  mitreTactic: string;
  mitreTechnique: string;
  confidenceScore: number;
  riskScore: number;
  detectionRuleId: string;
  evidence: string[];
  recommendedAction: string;
};

export type SentinelIncident = {
  incidentId: string;
  title: string;
  description: string;
  timestamp: string;
  sourceSystem: string;
  severity: SentinelSeverity;
  status: SentinelStatus;
  category: string;
  affectedAssetId: string;
  affectedAssetName: string;
  affectedUser: string;
  sourceIp: string;
  destinationIp: string;
  destinationHost: string;
  mitreTactic: string;
  mitreTechnique: string;
  confidenceScore: number;
  riskScore: number;
  detectionRuleId: string;
  evidence: string[];
  recommendedAction: string;
};

export type DetectionRule = {
  ruleId: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: SentinelSeverity;
  category: string;
  mitreTactic: string;
  mitreTechnique: string;
  logicType: string;
  queryDescription: string;
  falsePositiveRate: string;
  lastTriggeredAt: string;
  recommendedResponse: string;
};

export type SentinelInsightAnalysis = {
  summary: {
    activeAlerts: number;
    criticalIncidents: number;
    averageThreatScore: number;
    triggeredDetectionRules: number;
    activeSecurityIncidents: number;
    dominantRiskLevel: RiskLevel;
  };
  alertTable: SentinelAlert[];
  incidentTimeline: {
    label: string;
    value: number;
  }[];
  severityDistribution: {
    label: string;
    value: number;
    color: string;
  }[];
  categoryDistribution: {
    label: string;
    value: number;
    color: string;
  }[];
  statusDistribution: {
    label: string;
    value: number;
    color: string;
  }[];
  detectionRules: DetectionRule[];
  pulseFeed: string[];
};
