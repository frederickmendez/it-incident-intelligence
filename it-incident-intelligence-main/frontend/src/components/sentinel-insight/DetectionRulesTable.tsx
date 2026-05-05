import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/shared/formatDate";
import type { DetectionRule } from "@/lib/sentinel-insight/types";

export function DetectionRulesTable({ rows }: { rows: DetectionRule[] }) {
  return (
    <DataTable
      rows={rows}
      getRowKey={(row) => row.ruleId}
      columns={[
        {
          key: "rule",
          header: "Rule",
          cell: (row) => (
            <div>
              <p className="font-mono text-[12px] text-[var(--nexus-green-pale)]">
                {row.ruleId}
              </p>
              <p className="mt-1 text-sm text-[var(--nexus-text)]">{row.name}</p>
            </div>
          ),
        },
        {
          key: "logic",
          header: "Logic",
          cell: (row) => (
            <div>
              <p className="text-sm text-[var(--nexus-text)]">{row.logicType}</p>
              <p className="mt-1 text-xs text-[var(--nexus-text-muted)]">
                {row.queryDescription}
              </p>
            </div>
          ),
        },
        {
          key: "mitre",
          header: "MITRE",
          cell: (row) => `${row.mitreTactic} • ${row.mitreTechnique}`,
        },
        {
          key: "last",
          header: "Last Triggered",
          cell: (row) => formatDate(row.lastTriggeredAt),
        },
        {
          key: "enabled",
          header: "Status",
          cell: (row) => (
            <StatusBadge
              status={row.enabled ? "healthy" : "offline"}
              label={row.enabled ? "enabled" : "disabled"}
            />
          ),
        },
      ]}
    />
  );
}
