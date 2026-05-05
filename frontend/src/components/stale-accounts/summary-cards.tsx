import type { StaleAccountSummary } from "@/lib/stale-account-cleanup/types";

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function SummaryCards({
  summary,
  asOfDate,
}: {
  summary: StaleAccountSummary;
  asOfDate: string;
}) {
  const cards = [
    {
      label: "Accounts Analyzed",
      value: summary.total_accounts.toLocaleString("en-US"),
      detail: `As of ${new Date(asOfDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
      accent: "violet",
    },
    {
      label: "Eligible For Suspension",
      value: summary.eligible_for_suspension.toLocaleString("en-US"),
      detail: `${formatCurrency(summary.automatic_suspension_monthly_savings_usd)} automatic monthly savings`,
      accent: "rose",
    },
    {
      label: "Manual Review Queue",
      value: summary.review_required.toLocaleString("en-US"),
      detail: "Requires manager or owner confirmation",
      accent: "amber",
    },
    {
      label: "Protected Review",
      value: summary.protected_review.toLocaleString("en-US"),
      detail: "Excluded from automatic suspension",
      accent: "emerald",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div className="kpi-card animate-in" data-accent={card.accent} key={card.label}>
          <p className="section-title mb-3">{card.label}</p>
          <p className="kpi-value text-3xl text-[var(--text-primary)]">{card.value}</p>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">{card.detail}</p>
        </div>
      ))}
    </div>
  );
}
