import type { StaleAccountSummary } from "@/lib/stale-account-cleanup/types";

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function SavingsPanel({ summary }: { summary: StaleAccountSummary }) {
  return (
    <div className="glass-card p-5 animate-in animate-in-delay-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-title mb-2">Estimated Savings</p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            {formatCurrency(summary.estimated_monthly_savings_usd)} / month
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {formatCurrency(summary.estimated_annual_savings_usd)} annualized opportunity across cleanup and review candidates.
          </p>
        </div>
        <div className="rounded-full bg-[var(--emerald-dim)] px-3 py-1 text-xs font-semibold text-[var(--emerald)]">
          License hygiene
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Automatic candidates
          </p>
          <p className="mt-2 font-mono text-xl font-semibold text-[var(--text-primary)]">
            {formatCurrency(summary.automatic_suspension_monthly_savings_usd)}
          </p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            {formatCurrency(summary.automatic_suspension_annual_savings_usd)} annualized
          </p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Review-backed opportunity
          </p>
          <p className="mt-2 font-mono text-xl font-semibold text-[var(--text-primary)]">
            {formatCurrency(
              summary.estimated_monthly_savings_usd -
                summary.automatic_suspension_monthly_savings_usd
            )}
          </p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Requires human approval before action
          </p>
        </div>
      </div>
    </div>
  );
}
