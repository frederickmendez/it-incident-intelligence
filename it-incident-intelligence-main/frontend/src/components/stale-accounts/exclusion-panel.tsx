import type { StaleAccountResult } from "@/lib/stale-account-cleanup/types";

export function ExclusionPanel({ items }: { items: StaleAccountResult[] }) {
  const protectedItems = items.filter((item) => item.protected_by.length > 0);

  return (
    <div className="glass-card p-5 animate-in animate-in-delay-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="section-title mb-2">Exclusion Reasons</p>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Protected accounts requiring review
          </h2>
        </div>
        <span className="priority-badge priority-p3">
          {protectedItems.length} protected
        </span>
      </div>

      {protectedItems.length > 0 ? (
        <div className="space-y-3">
          {protectedItems.map((item) => (
            <div
              className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4"
              key={item.account_id}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{item.display_name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{item.email}</p>
                </div>
                <p className="font-mono text-xs text-[var(--amber)]">
                  {item.inactivity_days} inactive days
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.protected_by.map((reason) => (
                  <span className="category-chip" key={`${item.account_id}-${reason}`}>
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--text-secondary)]">
          No analyzed accounts are currently protected from automatic suspension.
        </p>
      )}
    </div>
  );
}
