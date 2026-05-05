import { DataTable } from "@/components/shared/DataTable";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/shared/formatDate";
import type { MdmNetworkConnection } from "@/lib/mdm-security/types";

export function NetworkConnectionsTable({
  rows,
}: {
  rows: MdmNetworkConnection[];
}) {
  return (
    <DataTable
      rows={rows}
      getRowKey={(row) => row.connectionId}
      columns={[
        {
          key: "conn",
          header: "Connection",
          cell: (row) => (
            <div>
              <p className="font-mono text-[12px] text-[var(--nexus-green-pale)]">
                {row.connectionId}
              </p>
              <p className="mt-1 text-xs text-[var(--nexus-text-muted)]">
                {formatDate(row.timestamp)}
              </p>
            </div>
          ),
        },
        {
          key: "destination",
          header: "Destination",
          cell: (row) => (
            <div>
              <p className="text-sm text-[var(--nexus-text)]">
                {row.destinationHost}:{row.destinationPort}
              </p>
              <p className="mt-1 text-xs text-[var(--nexus-text-muted)]">
                {row.protocol} • {row.networkZone}
              </p>
            </div>
          ),
        },
        {
          key: "status",
          header: "Status",
          cell: (row) => (
            <StatusBadge
              status={
                row.connectionStatus === "blocked"
                  ? "critical"
                  : row.connectionStatus === "stale"
                    ? "warning"
                    : "healthy"
              }
              label={row.connectionStatus}
            />
          ),
        },
        {
          key: "risk",
          header: "Risk",
          cell: (row) => <RiskBadge level={row.riskLevel} />,
        },
        {
          key: "reason",
          header: "Reason",
          cell: (row) => row.reason,
        },
      ]}
    />
  );
}
