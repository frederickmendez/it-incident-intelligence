import { GaugeChart } from "@/components/charts/GaugeChart";
import { SectionPanel } from "@/components/shared/SectionPanel";
import type { TicketClassifierAnalysis } from "@/lib/ticket-classifier/types";

export function SlaRiskPanel({
  analysis,
}: {
  analysis: TicketClassifierAnalysis;
}) {
  return (
    <SectionPanel title="SLA Risk Panel" eyebrow="Urgency Summary">
      <div className="min-w-0 space-y-5">
        <GaugeChart
          value={analysis.summary.averagePriorityScore}
          label="Average Priority Score"
        />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="min-w-0 rounded-lg border border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.52)] p-4">
            <p className="break-words font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-[var(--nexus-text-muted)]">
              P1 / P2 Load
            </p>
            <p className="mt-2 break-words text-2xl font-semibold leading-none text-[var(--nexus-text)]">
              {analysis.summary.p1P2Tickets}
            </p>
          </div>
          <div className="min-w-0 rounded-lg border border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.52)] p-4">
            <p className="break-words font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-[var(--nexus-text-muted)]">
              SLA Breach Risk
            </p>
            <p className="mt-2 break-words text-2xl font-semibold leading-none text-[var(--nexus-text)]">
              {analysis.summary.slaBreachRisk}
            </p>
          </div>
        </div>
      </div>
    </SectionPanel>
  );
}
