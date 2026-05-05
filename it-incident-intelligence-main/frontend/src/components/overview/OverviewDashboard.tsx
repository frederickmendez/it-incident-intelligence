import { HexGrid } from "@/components/charts/HexGrid";
import { ThreatAreaChart } from "@/components/charts/ThreatAreaChart";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { ModuleHealthBreakdown } from "@/components/reports/ModuleHealthBreakdown";
import { FilterChip } from "@/components/shared/FilterChip";
import { KpiCard } from "@/components/shared/KpiCard";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { AccentBars, StatusHalo } from "@/components/shared/nexus-visuals";
import { SectionPanel } from "@/components/shared/SectionPanel";
import { SecurityPulseWidget } from "@/components/shared/SecurityPulseWidget";
import { formatCurrency } from "@/lib/shared/formatCurrency";
import type { DashboardSummary } from "@/lib/shared/dashboard-summary";

export function OverviewDashboard({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Overview Command Center"
        title="Enterprise operations mission control"
        description={summary.executiveSummary}
        aside={
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--nexus-text-muted)]">
                Executive Focus
              </p>
              <RiskBadge
                level={summary.globalRiskLevel}
                label={summary.scenario.shortLabel}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterChip label="Global Risk" active />
              <FilterChip label="Cloud Waste" />
              <FilterChip label="P1/P2 Queue" />
              <FilterChip label="Active Incidents" />
            </div>
            <p className="text-sm leading-6 text-[var(--nexus-text-soft)]">
              {summary.scenario.subtitle}
            </p>
          </div>
        }
      />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionPanel title="What Needs Attention Now" eyebrow="Executive Strip">
          <div className="grid auto-rows-fr gap-3 md:grid-cols-2">
            {summary.attentionItems.map((item, index) => (
              <article
                key={`${item.module}-${item.title}`}
                className="flex min-h-[13rem] flex-col rounded-[1rem] border border-[var(--nexus-border-subtle)] bg-[linear-gradient(180deg,rgba(34,197,94,0.05),rgba(4,10,6,0.62))] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--nexus-text-muted)]">
                      {item.module}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-[var(--nexus-text)]">
                      {item.title}
                    </h3>
                  </div>
                  <StatusHalo
                    tone={item.accent}
                    label={`Focus ${String(index + 1).padStart(2, "0")}`}
                  />
                </div>
                <p className="mt-3 flex-1 text-sm leading-6 text-[var(--nexus-text-soft)]">
                  {item.detail}
                </p>
                <div className="mt-auto grid gap-2 rounded-[0.95rem] border border-[rgba(220,255,220,0.08)] bg-[rgba(220,255,220,0.03)] px-3 py-2 sm:grid-cols-[1fr_auto] sm:items-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--nexus-text-muted)]">
                    Attention signal
                  </p>
                  <div className="sm:justify-self-end">
                    <AccentBars
                      tone={item.accent}
                      bars={[24 + index * 4, 38 + index * 3, 54, 72]}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionPanel>
        <SectionPanel title="Top Actions" eyebrow="Operator Priorities">
          <div className="space-y-3">
            {summary.topActions.map((action, index) => (
              <div
                key={`${action.module}-${action.title}`}
                className="rounded-[1rem] border border-[var(--nexus-border-subtle)] bg-[linear-gradient(180deg,rgba(34,197,94,0.05),rgba(4,10,6,0.58))] px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
                      {index + 1}. {action.module}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--nexus-text)]">
                      {action.title}
                    </p>
                  </div>
                  <AccentBars tone="green" bars={[18, 28, 40, 64]} />
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--nexus-text-soft)]">
                  {action.detail}
                </p>
              </div>
            ))}
          </div>
        </SectionPanel>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        <KpiCard
          label="Global Risk Score"
          value={String(summary.globalRiskScore)}
          description="Cross-module blended risk posture across cloud, endpoint, ticket, security, and identity signals."
          riskLevel={summary.globalRiskLevel}
          trend="Cross-module aggregate"
          variant="green"
        />
        <KpiCard
          label="Monthly Cloud Waste"
          value={formatCurrency(summary.totalMonthlyCloudWaste)}
          description="Estimated monthly waste surfaced by the Cloud Cost Auditor."
          riskLevel={summary.cloud.summary.dominantRiskLevel}
          trend={`${summary.cloud.summary.optimizationCandidates} candidates`}
          variant="blue"
        />
        <KpiCard
          label="High-Risk Devices"
          value={String(summary.highRiskManagedDevices)}
          description="Managed devices flagged as high or critical risk by the endpoint posture analyzer."
          riskLevel={summary.mdm.summary.dominantRiskLevel}
          trend={`${summary.mdm.summary.nonCompliantDevices} non-compliant`}
          variant="orange"
        />
        <KpiCard
          label="P1 / P2 Tickets"
          value={String(summary.p1P2UrgentTickets)}
          description="Urgent helpdesk demand requiring escalation or same-shift action."
          riskLevel={summary.p1P2UrgentTicketRiskLevel}
          trend={`${summary.tickets.summary.openTickets} open tickets`}
          variant="purple"
        />
        <KpiCard
          label="Active Security Incidents"
          value={String(summary.activeSecurityIncidents)}
          description="SOC-style incidents currently open or contained in Sentinel Insight."
          riskLevel={summary.sentinel.summary.dominantRiskLevel}
          trend={`${summary.sentinel.summary.activeAlerts} active alerts`}
          variant="red"
        />
        <KpiCard
          label="Identity Savings"
          value={formatCurrency(
            summary.staleAccounts.summary.estimated_monthly_savings_usd
          )}
          description="Estimated monthly license savings if stale identity accounts are remediated."
          riskLevel={summary.staleAccountRiskLevel}
          trend={`${summary.staleAccounts.summary.stale_accounts} stale accounts`}
          variant="gold"
        />
      </section>

      <SectionPanel title="Module Storyboard" eyebrow="Suite Preview">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {summary.moduleSnapshots.map((item, index) => (
            <article
              key={item.key}
              className="flex min-h-[13rem] flex-col rounded-[1rem] border border-[var(--nexus-border-subtle)] bg-[linear-gradient(180deg,rgba(34,197,94,0.06),rgba(4,10,6,0.62))] p-4"
            >
              <div className="space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
                  {item.label}
                </p>
                <div className="min-w-0">
                  <StatusHalo
                    tone={item.accent}
                    label={`Lane ${String(index + 1).padStart(2, "0")}`}
                  />
                </div>
                <p className="text-2xl font-semibold text-[var(--nexus-text)]">
                  {item.metric}
                </p>
              </div>
              <p className="mt-3 flex-1 text-sm leading-6 text-[var(--nexus-text-soft)]">
                {item.detail}
              </p>
              <div className="mt-auto grid gap-2 rounded-[0.95rem] border border-[rgba(220,255,220,0.08)] bg-[rgba(220,255,220,0.03)] px-3 py-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--nexus-text-muted)]">
                  Signal density
                </p>
                <AccentBars
                  tone={item.accent}
                  bars={[22 + index * 5, 34 + index * 4, 48 + index * 3, 62]}
                />
              </div>
            </article>
          ))}
        </div>
      </SectionPanel>

      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.4fr_0.95fr]">
        <SectionPanel title="Threat Level Chart" eyebrow="Sentinel + Endpoint Signals">
          <ThreatAreaChart points={summary.threatLevelChart} />
        </SectionPanel>
        <SectionPanel title="Security Pulse Feed" eyebrow="Mock Real-Time Feed">
          <SecurityPulseWidget
            events={summary.securityPulseFeed.map((message, index) => ({
              id: `pulse-${index}`,
              timestamp: new Date(
                Date.now() - index * 1000 * 60 * 12
              ).toISOString(),
              message,
            }))}
          />
        </SectionPanel>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionPanel title="Status Node Grid" eyebrow="Module Health">
          <HexGrid nodes={summary.statusNodes} />
        </SectionPanel>
        <SectionPanel title="Module Health Breakdown" eyebrow="Operational Status">
          <ModuleHealthBreakdown modules={summary.moduleHealth} />
        </SectionPanel>
      </section>
    </div>
  );
}
