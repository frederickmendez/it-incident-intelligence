import { maxRiskLevel } from "@/lib/shared/riskLevels";
import { calculateCloudWasteRiskScore, deriveCloudWasteRiskLevel } from "./scoring";
import type {
  CloudCostAnalysis,
  CloudOptimizationCandidate,
  CloudProvider,
  CloudProviderBreakdown,
  CloudResourceRecord,
  CloudResourceTypeBreakdown,
} from "./types";

export function analyzeCloudCost(
  resources: CloudResourceRecord[]
): CloudCostAnalysis {
  const candidates = resources
    .filter((resource) => resource.estimatedMonthlyWasteUsd > 0)
    .map<CloudOptimizationCandidate>((resource) => ({
      ...resource,
      computedRiskScore: calculateCloudWasteRiskScore(resource),
      computedRiskLevel: deriveCloudWasteRiskLevel(resource),
    }))
    .sort(
      (left, right) =>
        right.estimatedMonthlyWasteUsd - left.estimatedMonthlyWasteUsd
    );

  const totalMonthlySpend = resources.reduce(
    (total, resource) => total + resource.monthlyCostUsd,
    0
  );
  const totalMonthlyWaste = round2(
    candidates.reduce(
      (total, candidate) => total + candidate.estimatedMonthlyWasteUsd,
      0
    )
  );

  return {
    summary: {
      totalResources: resources.length,
      optimizationCandidates: candidates.length,
      totalMonthlyWasteUsd: totalMonthlyWaste,
      healthySpendUsd: round2(Math.max(0, totalMonthlySpend - totalMonthlyWaste)),
      recoverableSpendRatio:
        totalMonthlySpend > 0
          ? Math.round((totalMonthlyWaste / totalMonthlySpend) * 100)
          : 0,
      idleServers: candidates.filter((item) => item.status === "idle").length,
      unattachedDisks: candidates.filter(
        (item) => item.status === "unattached"
      ).length,
      orphanedResources: candidates.filter(
        (item) => item.status === "orphaned"
      ).length,
      highestCostWasteUsd:
        candidates[0]?.estimatedMonthlyWasteUsd ?? 0,
      dominantRiskLevel: maxRiskLevel(
        candidates.map((candidate) => candidate.computedRiskLevel)
      ),
    },
    byProvider: groupByProvider(candidates),
    byResourceType: groupByResourceType(candidates),
    recommendedActions: buildRecommendedActions(candidates),
    financialImpactSummary: buildFinancialImpactSummary(candidates),
    items: candidates,
  };
}

function groupByProvider(
  candidates: CloudOptimizationCandidate[]
): CloudProviderBreakdown[] {
  const map = new Map<CloudProvider, { waste: number; count: number }>();

  for (const candidate of candidates) {
    const current = map.get(candidate.provider) ?? { waste: 0, count: 0 };
    current.waste += candidate.estimatedMonthlyWasteUsd;
    current.count += 1;
    map.set(candidate.provider, current);
  }

  return Array.from(map.entries())
    .map(([provider, value]) => ({
      provider,
      totalMonthlyWasteUsd: round2(value.waste),
      resourceCount: value.count,
    }))
    .sort((left, right) => right.totalMonthlyWasteUsd - left.totalMonthlyWasteUsd);
}

function groupByResourceType(
  candidates: CloudOptimizationCandidate[]
): CloudResourceTypeBreakdown[] {
  const map = new Map<string, { waste: number; count: number }>();

  for (const candidate of candidates) {
    const current = map.get(candidate.resourceType) ?? { waste: 0, count: 0 };
    current.waste += candidate.estimatedMonthlyWasteUsd;
    current.count += 1;
    map.set(candidate.resourceType, current);
  }

  return Array.from(map.entries())
    .map(([resourceType, value]) => ({
      resourceType,
      totalMonthlyWasteUsd: round2(value.waste),
      resourceCount: value.count,
    }))
    .sort((left, right) => right.totalMonthlyWasteUsd - left.totalMonthlyWasteUsd);
}

function buildRecommendedActions(
  candidates: CloudOptimizationCandidate[]
): string[] {
  const actions = new Set<string>();

  for (const candidate of candidates.slice(0, 5)) {
    actions.add(candidate.recommendedAction);
  }

  return Array.from(actions);
}

function buildFinancialImpactSummary(
  candidates: CloudOptimizationCandidate[]
): string {
  const productionWaste = candidates
    .filter((candidate) => candidate.environment === "production")
    .reduce((total, candidate) => total + candidate.estimatedMonthlyWasteUsd, 0);
  const annualized = round2(
    candidates.reduce((total, candidate) => total + candidate.estimatedMonthlyWasteUsd, 0) * 12
  );

  return `${candidates.length} optimization candidates represent ${round2(
    productionWaste
  ).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  })} in production-linked monthly waste and ${annualized.toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }
  )} in annualized savings opportunity.`;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
