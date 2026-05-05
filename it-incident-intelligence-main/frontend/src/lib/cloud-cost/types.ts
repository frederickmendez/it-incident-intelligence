import type { RiskLevel } from "@/lib/shared/riskLevels";

export type CloudProvider = "AWS" | "Azure" | "GCP";

export type CloudEnvironment =
  | "production"
  | "staging"
  | "development"
  | "sandbox";

export type CloudResourceStatus =
  | "running"
  | "stopped"
  | "idle"
  | "unattached"
  | "reserved"
  | "orphaned";

export type CloudWasteSignal =
  | "low_cpu"
  | "low_network_io"
  | "unattached_storage"
  | "stopped_compute_storage_cost"
  | "unused_ip"
  | "overprovisioned_instance"
  | "snapshot_retention_drift"
  | "rightsizing_candidate";

export type CloudOwner = {
  team: string;
  cost_center: string;
  business_unit: string;
  technical_owner: string;
};

export type CloudUtilizationSnapshot = {
  cpu_average_percent_14d: number | null;
  memory_average_percent_14d: number | null;
  network_gb_14d: number | null;
  storage_gb: number | null;
  last_seen_at: string;
};

export type CloudResource = {
  id: string;
  name: string;
  provider: CloudProvider;
  account_id: string;
  region: string;
  service: string;
  resource_type: string;
  environment: CloudEnvironment;
  status: CloudResourceStatus;
  monthly_cost_usd: number;
  projected_monthly_waste_usd: number;
  utilization: CloudUtilizationSnapshot;
  waste_signals: CloudWasteSignal[];
  owner: CloudOwner;
  tags: Record<string, string>;
};

export type CloudResourceRecord = {
  id: string;
  provider: CloudProvider;
  accountId: string;
  region: string;
  resourceType: string;
  serviceName: string;
  resourceName: string;
  environment: CloudEnvironment;
  ownerTeam: string;
  costCenter: string;
  status: CloudResourceStatus;
  monthlyCostUsd: number;
  estimatedMonthlyWasteUsd: number;
  cpuUtilizationPercent: number;
  memoryUtilizationPercent: number;
  storageUsedPercent: number;
  lastActivityAt: string;
  riskLevel: RiskLevel;
  wasteReason: string;
  recommendedAction: string;
};

export type CloudOptimizationCandidate = CloudResourceRecord & {
  computedRiskScore: number;
  computedRiskLevel: RiskLevel;
};

export type CloudProviderBreakdown = {
  provider: CloudProvider;
  totalMonthlyWasteUsd: number;
  resourceCount: number;
};

export type CloudResourceTypeBreakdown = {
  resourceType: string;
  totalMonthlyWasteUsd: number;
  resourceCount: number;
};

export type CloudCostAnalysis = {
  summary: {
    totalResources: number;
    optimizationCandidates: number;
    totalMonthlyWasteUsd: number;
    healthySpendUsd: number;
    recoverableSpendRatio: number;
    idleServers: number;
    unattachedDisks: number;
    orphanedResources: number;
    highestCostWasteUsd: number;
    dominantRiskLevel: RiskLevel;
  };
  byProvider: CloudProviderBreakdown[];
  byResourceType: CloudResourceTypeBreakdown[];
  recommendedActions: string[];
  financialImpactSummary: string;
  items: CloudOptimizationCandidate[];
};
