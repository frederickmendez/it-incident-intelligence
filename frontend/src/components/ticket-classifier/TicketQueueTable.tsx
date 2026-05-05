import { DataTable } from "@/components/shared/DataTable";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/shared/formatDate";
import { buildTicketReasonTokens } from "@/lib/ticket-classifier/reason-view-model";
import type { TicketClassification } from "@/lib/ticket-classifier/types";

const TOKEN_TONE_CLASSES = {
  green:
    "border-[rgba(34,197,94,0.22)] bg-[rgba(34,197,94,0.08)] text-[var(--nexus-green-pale)]",
  blue: "border-[rgba(56,189,248,0.22)] bg-[rgba(56,189,248,0.08)] text-[var(--nexus-text)]",
  orange:
    "border-[rgba(245,158,11,0.22)] bg-[rgba(245,158,11,0.08)] text-[var(--nexus-warning-bright)]",
  purple:
    "border-[rgba(168,85,247,0.22)] bg-[rgba(168,85,247,0.08)] text-[var(--nexus-purple)]",
  red: "border-[rgba(239,68,68,0.22)] bg-[rgba(239,68,68,0.08)] text-[var(--nexus-red)]",
  gold:
    "border-[rgba(255,238,170,0.22)] bg-[rgba(255,238,170,0.08)] text-[var(--nexus-gold)]",
} as const;

export function TicketQueueTable({
  rows,
}: {
  rows: TicketClassification[];
}) {
  return (
    <DataTable
      rows={rows}
      getRowKey={(row) => row.ticketId}
      columns={[
        {
          key: "ticket",
          header: "Ticket",
          cell: (row) => (
            <div>
              <p className="font-mono text-[12px] text-[var(--nexus-green-pale)]">
                {row.ticketId}
              </p>
              <p className="mt-1 text-sm text-[var(--nexus-text)]">{row.title}</p>
              <p className="mt-1 text-xs text-[var(--nexus-text-muted)]">
                {row.requesterDepartment} / {row.channel}
              </p>
            </div>
          ),
        },
        {
          key: "priority",
          header: "Priority",
          cell: (row) => (
            <RiskBadge
              level={row.slaRiskLevel}
              label={`${row.predictedPriority} / ${row.priorityScore}`}
            />
          ),
        },
        {
          key: "impact",
          header: "Business Impact",
          cell: (row) => (
            <div>
              <p className="text-sm text-[var(--nexus-text)]">{row.businessImpact}</p>
              <p className="mt-1 text-xs text-[var(--nexus-text-muted)]">
                {row.affectedUsersCount} users / VIP {row.isVipRequester ? "yes" : "no"}
              </p>
            </div>
          ),
        },
        {
          key: "status",
          header: "Status",
          cell: (row) => (
            <div>
              <StatusBadge
                status={row.status === "resolved" ? "resolved" : "open"}
                label={row.status}
              />
              <p className="mt-2 font-mono text-[11px] text-[var(--nexus-text-muted)]">
                Due {formatDate(row.slaDueAt)}
              </p>
            </div>
          ),
        },
        {
          key: "reason",
          header: "Classification Reason",
          cell: (row) => {
            const reasonTokens = buildTicketReasonTokens(row.classificationReason);

            return (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {reasonTokens.map((token) => (
                    <span
                      key={`${row.ticketId}-${token.label}-${token.value}`}
                      className={[
                        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]",
                        TOKEN_TONE_CLASSES[token.tone],
                      ].join(" ")}
                    >
                      <span className="text-[var(--nexus-text-muted)]">
                        {token.label}
                      </span>
                      <span>{token.value}</span>
                    </span>
                  ))}
                </div>
                <div className="rounded-[0.95rem] border border-[rgba(34,197,94,0.14)] bg-[rgba(34,197,94,0.06)] px-3 py-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--nexus-text-muted)]">
                    Next Action
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--nexus-green)]">
                    {row.recommendedAction}
                  </p>
                </div>
              </div>
            );
          },
        },
      ]}
    />
  );
}
