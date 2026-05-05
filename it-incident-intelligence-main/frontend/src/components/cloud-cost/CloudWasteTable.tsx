import { DataTable } from "@/components/shared/DataTable";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { formatCurrency } from "@/lib/shared/formatCurrency";
import type { CloudOptimizationCandidate } from "@/lib/cloud-cost/types";

export function CloudWasteTable({
  rows,
}: {
  rows: CloudOptimizationCandidate[];
}) {
  return (
    <DataTable
      rows={rows}
      getRowKey={(row) => row.id}
      columns={[
        {
          key: "resource",
          header: "Resource",
          cell: (row) => (
            <div>
              <p className="font-mono text-[12px] text-[var(--nexus-green-pale)]">
                {row.id}
              </p>
              <p className="mt-1 text-sm text-[var(--nexus-text)]">
                {row.resourceName}
              </p>
            </div>
          ),
        },
        {
          key: "provider",
          header: "Provider / Service",
          cell: (row) => (
            <div>
              <p className="text-sm text-[var(--nexus-text)]">{row.provider}</p>
              <p className="mt-1 text-xs text-[var(--nexus-text-muted)]">
                {row.serviceName} • {row.region}
              </p>
            </div>
          ),
        },
        {
          key: "waste",
          header: "Waste",
          className: "whitespace-nowrap font-mono text-[var(--nexus-green-pale)]",
          cell: (row) => formatCurrency(row.estimatedMonthlyWasteUsd),
        },
        {
          key: "risk",
          header: "Risk",
          cell: (row) => <RiskBadge level={row.computedRiskLevel} />,
        },
        {
          key: "reason",
          header: "Waste Reason",
          cell: (row) => (
            <div>
              <p className="text-sm text-[var(--nexus-text-soft)]">
                {row.wasteReason}
              </p>
              <p className="mt-1 text-xs text-[var(--nexus-text-muted)]">
                {row.recommendedAction}
              </p>
            </div>
          ),
        },
      ]}
    />
  );
}
