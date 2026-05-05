import { DonutChart } from "@/components/charts/DonutChart";
import { SectionPanel } from "@/components/shared/SectionPanel";

export function ThreatSeverityPanel({
  segments,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
}) {
  return (
    <SectionPanel title="Threat Severity Visualization" eyebrow="Severity Distribution">
      <DonutChart
        centerLabel="Active Alerts"
        centerValue={String(segments.reduce((sum, segment) => sum + segment.value, 0))}
        segments={segments}
      />
    </SectionPanel>
  );
}
