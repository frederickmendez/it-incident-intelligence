import type { ExecutiveDashboardSummary } from "@/lib/shared/dashboard-summary";

export function ExecutiveOverview({
  summary,
}: {
  summary: ExecutiveDashboardSummary;
}) {
  return (
    <div className="flex flex-col gap-5">
      <section className="glass-card-elevated border-l-4 border-[var(--teal)] p-5 animate-in">
        <p className="section-title mb-2">Nexus Executive Overview</p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
          Operations and security posture
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--text-secondary)]">
          {summary.executiveSummary}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summary.kpis.map((kpi) => (
          <article key={kpi.id} className="kpi-card animate-in">
            <p className="section-title mb-2">{kpi.label}</p>
            <p className="kpi-value text-3xl text-[var(--text-primary)]">
              {kpi.value}
            </p>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {kpi.supportingText}
            </p>
            <p className="mt-3 text-[11px] font-medium text-[var(--teal)]">
              {kpi.sourceModule}
            </p>
          </article>
        ))}
      </section>

      <section className="glass-card p-5 animate-in">
        <p className="section-title mb-3">How This Summary Is Calculated</p>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {summary.calculationNotes.map((note) => (
            <p
              key={note}
              className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 text-xs leading-5 text-[var(--text-secondary)]"
            >
              {note}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
