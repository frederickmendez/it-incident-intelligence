import type { StaleAccountResult } from "@/lib/stale-account-cleanup/types";
import { ActionBadge, RiskBadge, StatusBadge } from "./badges";

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function AccountsTable({ items }: { items: StaleAccountResult[] }) {
  return (
    <div className="glass-card overflow-hidden animate-in animate-in-delay-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] p-4">
        <div>
          <p className="section-title mb-1">Stale Accounts Table</p>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Analyzed account findings
          </h2>
        </div>
        <span className="text-xs text-[var(--text-muted)]">
          {items.length} accounts evaluated
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table min-w-[1120px]">
          <thead>
            <tr>
              <th>Account</th>
              <th>Provider</th>
              <th>Department</th>
              <th>Privilege</th>
              <th className="text-right">Inactive</th>
              <th>Status</th>
              <th>Risk</th>
              <th>Action</th>
              <th className="text-right">Monthly Savings</th>
              <th>Exclusion / Reason</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.account_id}>
                <td>
                  <div className="font-medium text-[var(--text-primary)]">
                    {item.display_name}
                  </div>
                  <div className="font-mono text-[11px] text-[var(--text-muted)]">
                    {item.email}
                  </div>
                </td>
                <td>{item.provider}</td>
                <td>{item.department}</td>
                <td className="font-mono text-[12px]">{item.privilege_level}</td>
                <td className="cell-num">{item.inactivity_days}d</td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
                <td>
                  <RiskBadge item={item} />
                </td>
                <td>
                  <ActionBadge action={item.recommended_action} />
                </td>
                <td className="cell-num text-[var(--text-primary)]">
                  {formatCurrency(item.savings.estimated_monthly_usd)}
                </td>
                <td className="max-w-sm">
                  {item.protected_by.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {item.protected_by.map((reason) => (
                        <span className="category-chip" key={`${item.account_id}-${reason}`}>
                          {reason}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">
                      {item.reasons[0] ?? "No exclusion returned by analyzer."}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
