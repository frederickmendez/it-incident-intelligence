import { DataTable } from "@/components/shared/DataTable";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/shared/formatDate";
import type { SentinelAlert } from "@/lib/sentinel-insight/types";

export function ThreatAlertTable({ rows }: { rows: SentinelAlert[] }) {
  return (
    <DataTable
      rows={rows}
      getRowKey={(row) => row.alertId}
      columns={[
        {
          key: "alert",
          header: "Alert",
          cell: (row) => (
            <div>
              <p className="font-mono text-[12px] text-[var(--nexus-green-pale)]">
                {row.alertId}
              </p>
              <p className="mt-1 text-sm text-[var(--nexus-text)]">{row.title}</p>
              <p className="mt-1 text-xs text-[var(--nexus-text-muted)]">
                {row.sourceSystem} • {formatDate(row.timestamp)}
              </p>
            </div>
          ),
        },
        {
          key: "mitre",
          header: "MITRE",
          cell: (row) => (
            <div>
              <p className="text-sm text-[var(--nexus-text)]">{row.mitreTactic}</p>
              <p className="mt-1 text-xs text-[var(--nexus-text-muted)]">
                {row.mitreTechnique}
              </p>
            </div>
          ),
        },
        {
          key: "status",
          header: "Status",
          cell: (row) => (
            <StatusBadge status={row.status} />
          ),
        },
        {
          key: "risk",
          header: "Severity",
          cell: (row) => <RiskBadge level={row.severity} label={`Risk ${row.riskScore}`} />,
        },
        {
          key: "response",
          header: "Recommended Action",
          cell: (row) => row.recommendedAction,
        },
      ]}
    />
  );
}
