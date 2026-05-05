import { BarChart } from "@/components/charts/BarChart";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { SectionPanel } from "@/components/shared/SectionPanel";
import { SecurityPulseWidget } from "@/components/shared/SecurityPulseWidget";
import type { SentinelInsightAnalysis } from "@/lib/sentinel-insight/types";
import { DetectionRulesTable } from "./DetectionRulesTable";
import { IncidentTimeline } from "./IncidentTimeline";
import { ThreatAlertTable } from "./ThreatAlertTable";
import { ThreatSeverityPanel } from "./ThreatSeverityPanel";

export function SentinelDashboard({
  analysis,
}: {
  analysis: SentinelInsightAnalysis;
}) {
  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Sentinel Insight"
        title="SOC-style alert and incident monitoring"
        description="Security alerting, incident posture, and MITRE-aligned detection coverage using deterministic mock SOC telemetry."
        aside={
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--nexus-text-muted)]">
              Detection Rules Triggered
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--nexus-text)]">
              {analysis.summary.triggeredDetectionRules}
            </p>
            <p className="mt-2 text-sm text-[var(--nexus-text-soft)]">
              unique rules fired across the current active alert set.
            </p>
          </div>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-5">
        <KpiCard label="Active Alerts" value={String(analysis.summary.activeAlerts)} description="Open or investigating alerts in the current SOC queue." riskLevel={analysis.summary.dominantRiskLevel} variant="green" />
        <KpiCard label="Critical Incidents" value={String(analysis.summary.criticalIncidents)} description="Highest-severity incidents currently being tracked." riskLevel={analysis.summary.criticalIncidents > 0 ? "critical" : "medium"} variant="red" />
        <KpiCard label="Average Threat Score" value={String(analysis.summary.averageThreatScore)} description="Average risk score across active alert telemetry." riskLevel={analysis.summary.dominantRiskLevel} variant="purple" />
        <KpiCard label="Triggered Rules" value={String(analysis.summary.triggeredDetectionRules)} description="Distinct detection rules responsible for the active signal set." riskLevel="medium" variant="blue" />
        <KpiCard label="Active Incidents" value={String(analysis.summary.activeSecurityIncidents)} description="Incidents that remain open, investigating, or contained." riskLevel={analysis.summary.activeSecurityIncidents > 1 ? "high" : "medium"} variant="gold" />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ThreatSeverityPanel segments={analysis.severityDistribution} />
        <SectionPanel title="Security Pulse Feed" eyebrow="SOC Feed">
          <SecurityPulseWidget
            events={analysis.pulseFeed.map((message, index) => ({
              id: `sentinel-${index}`,
              timestamp: new Date(
                Date.now() - index * 1000 * 60 * 10
              ).toISOString(),
              message,
            }))}
          />
        </SectionPanel>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionPanel title="Alert Categories" eyebrow="Threat Themes">
          <BarChart items={analysis.categoryDistribution} />
        </SectionPanel>
        <SectionPanel title="Alert Status Mix" eyebrow="Incident Progress">
          <BarChart items={analysis.statusDistribution} />
        </SectionPanel>
      </section>

      <SectionPanel title="Alert Table" eyebrow="Alert Queue">
        <ThreatAlertTable rows={analysis.alertTable} />
      </SectionPanel>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <IncidentTimeline items={analysis.incidentTimeline} />
        <SectionPanel title="Detection Rules Table" eyebrow="Coverage Detail">
          <DetectionRulesTable rows={analysis.detectionRules} />
        </SectionPanel>
      </section>

      <SectionPanel title="Top Incident Narratives" eyebrow="Readable Incident View">
        <div className="grid gap-4 xl:grid-cols-3">
          {analysis.alertTable.slice(0, 3).map((alert) => (
            <article
              key={alert.alertId}
              className="rounded-[1rem] border border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.52)] p-4"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
                {alert.alertId} • {alert.mitreTechnique}
              </p>
              <h3 className="mt-2 text-base font-semibold text-[var(--nexus-text)]">
                {alert.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--nexus-text-soft)]">
                {alert.description}
              </p>
              <p className="mt-3 text-xs text-[var(--nexus-green)]">
                {alert.recommendedAction}
              </p>
            </article>
          ))}
        </div>
      </SectionPanel>
    </div>
  );
}
