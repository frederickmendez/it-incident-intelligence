import { SectionPanel } from "@/components/shared/SectionPanel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/shared/formatDate";
import type { MdmActivityLog } from "@/lib/mdm-security/types";

export function UserActivityFeed({ rows }: { rows: MdmActivityLog[] }) {
  return (
    <SectionPanel title="Recent Suspicious Activity" eyebrow="User Activity Feed">
      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.logId}
            className="rounded-[1rem] border border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.52)] p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
                  {row.logId} • {row.eventType}
                </p>
                <p className="mt-2 text-sm text-[var(--nexus-text)]">
                  {row.description}
                </p>
              </div>
              <StatusBadge
                status={row.isSuspicious ? "investigating" : "healthy"}
                label={row.severity}
              />
            </div>
            <p className="mt-3 font-mono text-[12px] text-[var(--nexus-text-soft)]">
              {row.userId} • {row.geoLocation} • {row.sourceIp} • {formatDate(row.timestamp)}
            </p>
          </div>
        ))}
      </div>
    </SectionPanel>
  );
}
