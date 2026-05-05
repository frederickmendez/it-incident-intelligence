import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { SectionPanel } from "@/components/shared/SectionPanel";
import type { MdmSecurityAnalysis } from "@/lib/mdm-security/types";
import { DeviceRiskTable } from "./DeviceRiskTable";
import { NetworkConnectionsTable } from "./NetworkConnectionsTable";
import { UserActivityFeed } from "./UserActivityFeed";

export function MdmSecurityDashboard({
  analysis,
}: {
  analysis: MdmSecurityAnalysis;
}) {
  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="MDM Security Monitor"
        title="Endpoint posture and device risk visibility"
        description="Managed-device posture, suspicious user activity, and network visibility from deterministic mock endpoint data."
        aside={
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--nexus-text-muted)]">
              Compliance Overlay
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--nexus-text)]">
              {analysis.compliancePosture.non_compliant}
            </p>
            <p className="mt-2 text-sm text-[var(--nexus-text-soft)]">
              non-compliant macOS devices imported from the existing compliance checker.
            </p>
          </div>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        <KpiCard label="Managed Devices" value={String(analysis.summary.totalManagedDevices)} description="Total devices in the mock MDM tenant for this environment." riskLevel="low" variant="green" />
        <KpiCard label="Non-Compliant Devices" value={String(analysis.summary.nonCompliantDevices)} description="Devices failing compliance posture or falling into warning state." riskLevel={analysis.summary.nonCompliantDevices > 2 ? "high" : "medium"} variant="orange" />
        <KpiCard label="High-Risk Devices" value={String(analysis.summary.highRiskDevices)} description="Endpoints with high or critical risk based on posture and device security signals." riskLevel={analysis.summary.dominantRiskLevel} variant="red" />
        <KpiCard label="Suspicious Events" value={String(analysis.summary.suspiciousEvents)} description="Activity feed entries marked suspicious by deterministic endpoint rules." riskLevel={analysis.summary.suspiciousEvents > 2 ? "high" : "medium"} variant="purple" />
        <KpiCard label="Active Endpoint Alerts" value={String(analysis.summary.activeEndpointAlerts)} description="Current endpoint alerts requiring analyst review or containment workflow." riskLevel={analysis.summary.activeEndpointAlerts > 2 ? "critical" : "high"} variant="gold" />
        <KpiCard label="Average Device Risk" value={String(analysis.summary.averageRiskScore)} description="Average device risk score across all managed devices in the mock fleet." riskLevel={analysis.summary.dominantRiskLevel} variant="blue" />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionPanel title="Device Compliance Posture" eyebrow="Risk Distribution">
          <DonutChart
            centerLabel="Devices"
            centerValue={String(analysis.summary.totalManagedDevices)}
            segments={analysis.riskDistribution}
          />
        </SectionPanel>
        <UserActivityFeed rows={analysis.suspiciousActivity.slice(0, 5)} />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionPanel title="Platform Split" eyebrow="Fleet Composition">
          <DonutChart
            centerLabel="Fleet"
            centerValue={String(analysis.summary.totalManagedDevices)}
            segments={analysis.platformDistribution}
          />
        </SectionPanel>
        <SectionPanel title="Compliance Posture Strip" eyebrow="Posture Summary">
          <BarChart items={analysis.complianceDistribution} />
        </SectionPanel>
      </section>

      <SectionPanel title="Recent Alert Narratives" eyebrow="Analyst Storyline">
        <div className="grid gap-4 xl:grid-cols-3">
          {analysis.deviceRiskTable.slice(0, 3).map((device) => (
            <article
              key={device.deviceId}
              className="rounded-[1rem] border border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.52)] p-4"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
                {device.deviceId}
              </p>
              <h3 className="mt-2 text-base font-semibold text-[var(--nexus-text)]">
                {device.deviceName}
              </h3>
              <p className="mt-2 text-sm text-[var(--nexus-text-soft)]">
                {device.riskReasons[0]}
              </p>
              <p className="mt-3 font-mono text-[11px] text-[var(--nexus-green-pale)]">
                {device.platform} • {device.department} • risk {device.riskScore}
              </p>
            </article>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel title="Device Risk Table" eyebrow="Endpoint Detail">
        <DeviceRiskTable rows={analysis.deviceRiskTable} />
      </SectionPanel>

      <SectionPanel title="Network Core Connections" eyebrow="Connection Visibility">
        <NetworkConnectionsTable rows={analysis.networkConnections} />
      </SectionPanel>
    </div>
  );
}
