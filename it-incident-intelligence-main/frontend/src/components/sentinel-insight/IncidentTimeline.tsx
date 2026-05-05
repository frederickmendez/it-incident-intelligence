import { SectionPanel } from "@/components/shared/SectionPanel";

export function IncidentTimeline({
  items,
}: {
  items: Array<{ label: string; value: number }>;
}) {
  return (
    <SectionPanel title="Incident Timeline" eyebrow="Open Incident Trend">
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-[1rem] border border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.52)] px-4 py-3"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
              {item.label}
            </span>
            <span className="text-lg font-semibold text-[var(--nexus-text)]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </SectionPanel>
  );
}
