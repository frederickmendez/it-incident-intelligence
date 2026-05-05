import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { SectionPanel } from "@/components/shared/SectionPanel";
import { formatCurrency } from "@/lib/shared/formatCurrency";
import type { DashboardSummary } from "@/lib/shared/dashboard-summary";
import { ExportSummaryCards } from "./ExportSummaryCards";
import { ModuleHealthBreakdown } from "./ModuleHealthBreakdown";

export function ReportsDashboard({
  summary,
}: {
  summary: DashboardSummary;
}) {
  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Reports"
        title="Executive export and summary center"
        description="Portfolio-safe reporting surface for leadership readouts, risk summaries, and mock export actions across all Nexus modules."
        aside={
          <div className="space-y-3">
            <div className="rounded-[1rem] border border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.52)] p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
                Active Scenario
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--nexus-text)]">
                {summary.scenario.label}
              </p>
              <p className="mt-1 text-sm text-[var(--nexus-text-soft)]">
                {summary.scenario.subtitle}
              </p>
            </div>
            <button className="w-full rounded-full border border-[var(--nexus-border-active)] bg-[var(--nexus-ghost)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--nexus-green-bright)] transition hover:border-[var(--nexus-green-bright)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nexus-green-bright)]">
              Mock CSV Export
            </button>
            <button className="w-full rounded-full border border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.54)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--nexus-text-soft)] transition hover:border-[var(--nexus-border-hover)] hover:text-[var(--nexus-green-pale)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nexus-green-bright)]">
              Mock JSON Export
            </button>
          </div>
        }
      />

      <ExportSummaryCards summary={summary} />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionPanel title="Executive Summary" eyebrow="Board-Ready Narrative">
          <div className="space-y-4 text-sm leading-7 text-[var(--nexus-text-soft)]">
            <p>{summary.executiveSummary}</p>
            <p>
              Compliance posture currently shows{" "}
              <strong className="text-[var(--nexus-text)]">
                {summary.compliance.summary.non_compliant}
              </strong>{" "}
              non-compliant macOS devices, while identity hygiene analysis flags{" "}
              <strong className="text-[var(--nexus-text)]">
                {summary.staleAccounts.summary.stale_accounts}
              </strong>{" "}
              stale accounts with an estimated monthly savings opportunity of{" "}
              <strong className="text-[var(--nexus-text)]">
                {formatCurrency(
                  summary.staleAccounts.summary.estimated_monthly_savings_usd
                )}
              </strong>
              .
            </p>
          </div>
        </SectionPanel>
        <SectionPanel title="Module Health Breakdown" eyebrow="Export Preview">
          <ModuleHealthBreakdown modules={summary.moduleHealth} />
        </SectionPanel>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionPanel title="Top Risks to Brief" eyebrow="Stakeholder Readout">
          <div className="space-y-3">
            {summary.attentionItems.slice(1).map((item) => (
              <div
                key={`${item.module}-${item.title}`}
                className="rounded-[1rem] border border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.52)] px-4 py-3"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
                  {item.module}
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--nexus-text)]">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-[var(--nexus-text-soft)]">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </SectionPanel>
        <SectionPanel title="Top Actions to Export" eyebrow="Action Summary">
          <div className="space-y-3">
            {summary.topActions.map((action) => (
              <div
                key={`${action.module}-${action.title}`}
                className="rounded-[1rem] border border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.52)] px-4 py-3"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
                  {action.module}
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--nexus-text)]">
                  {action.title}
                </p>
                <p className="mt-1 text-sm text-[var(--nexus-text-soft)]">
                  {action.detail}
                </p>
              </div>
            ))}
          </div>
        </SectionPanel>
      </section>
    </div>
  );
}
