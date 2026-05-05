import { DataTable } from "@/components/shared/DataTable";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { MdmDeviceRecord } from "@/lib/mdm-security/types";

export function DeviceRiskTable({ rows }: { rows: MdmDeviceRecord[] }) {
  return (
    <DataTable
      rows={rows}
      getRowKey={(row) => row.deviceId}
      columns={[
        {
          key: "device",
          header: "Device",
          cell: (row) => (
            <div>
              <p className="font-mono text-[12px] text-[var(--nexus-green-pale)]">
                {row.deviceId}
              </p>
              <p className="mt-1 text-sm text-[var(--nexus-text)]">
                {row.deviceName}
              </p>
            </div>
          ),
        },
        {
          key: "user",
          header: "Assigned User",
          cell: (row) => (
            <div>
              <p className="text-sm text-[var(--nexus-text)]">{row.assignedUser}</p>
              <p className="mt-1 text-xs text-[var(--nexus-text-muted)]">
                {row.department} • {row.location}
              </p>
            </div>
          ),
        },
        {
          key: "compliance",
          header: "Compliance",
          cell: (row) => (
            <StatusBadge
              status={
                row.complianceStatus === "compliant"
                  ? "healthy"
                  : row.complianceStatus === "warning"
                    ? "warning"
                    : "critical"
              }
              label={row.complianceStatus.replace("_", " ")}
            />
          ),
        },
        {
          key: "risk",
          header: "Risk",
          cell: (row) => <RiskBadge level={row.riskLevel} label={`Risk ${row.riskScore}`} />,
        },
        {
          key: "reasons",
          header: "Risk Reasons",
          cell: (row) => (
            <ul className="space-y-1 text-sm text-[var(--nexus-text-soft)]">
              {row.riskReasons.map((reason) => (
                <li key={reason}>• {reason}</li>
              ))}
            </ul>
          ),
        },
      ]}
    />
  );
}
