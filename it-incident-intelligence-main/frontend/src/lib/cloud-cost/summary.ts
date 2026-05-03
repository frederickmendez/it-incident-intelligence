import type { CloudResource } from "./types";

type CloudWasteResource = Pick<CloudResource, "projected_monthly_waste_usd">;

export type CloudCostAuditorSummary = {
  summary: {
    total_monthly_waste_usd: number;
    waste_resource_count: number;
  };
  calculation_notes: string[];
};

export function summarizeCloudCostAuditor(
  resources: CloudWasteResource[]
): CloudCostAuditorSummary {
  const totalMonthlyWaste = resources.reduce(
    (total, resource) => total + resource.projected_monthly_waste_usd,
    0
  );
  const wasteResources = resources.filter(
    (resource) => resource.projected_monthly_waste_usd > 0
  );

  return {
    summary: {
      total_monthly_waste_usd: roundCurrency(totalMonthlyWaste),
      waste_resource_count: wasteResources.length,
    },
    calculation_notes: [
      `Cloud Cost Auditor sums projected_monthly_waste_usd across ${resources.length} mock cloud resources.`,
      `${wasteResources.length} resources currently contribute projected monthly waste.`,
    ],
  };
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}
