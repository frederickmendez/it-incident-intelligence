"use client";

import { useMemo, useState } from "react";
import type { DashboardData, RecurringProblem } from "@/types/incident";

type SortKey = "frequency" | "trend_delta" | "last_seen";

const CATEGORY_COLORS: Record<string, string> = {
  Access: "var(--violet)",
  Network: "var(--sky)",
  Application: "var(--rose)",
  Email: "var(--amber)",
  Infrastructure: "var(--emerald)",
};

function sortRecurring(items: RecurringProblem[], key: SortKey): RecurringProblem[] {
  return [...items].sort((a, b) => {
    if (key === "last_seen") return b.last_seen.localeCompare(a.last_seen);
    return b[key] - a[key];
  });
}

export function IncidentsView({ data }: { data: DashboardData }) {
  const [serviceFilter, setServiceFilter] = useState("all");
  const [bucketFilter, setBucketFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("frequency");

  const serviceOptions = useMemo(() => {
    const set = new Set(data.recurring.map((r) => r.service));
    return ["all", ...Array.from(set).sort()];
  }, [data.recurring]);

  const bucketOptions = useMemo(() => {
    const set = new Set(data.recurring.map((r) => r.keyword_bucket));
    return ["all", ...Array.from(set).sort()];
  }, [data.recurring]);

  const filtered = useMemo(() => {
    let items = data.recurring;
    if (serviceFilter !== "all") items = items.filter((r) => r.service === serviceFilter);
    if (bucketFilter !== "all") items = items.filter((r) => r.keyword_bucket === bucketFilter);
    return sortRecurring(items, sortKey);
  }, [data.recurring, serviceFilter, bucketFilter, sortKey]);

  const maxFreq = Math.max(...data.recurring.map((r) => r.frequency), 1);

  return (
    <div className="flex flex-col gap-5">
      {/* Header + Filters */}
      <div className="glass-card p-5 animate-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Recurring Incident Patterns
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {filtered.length} pattern{filtered.length !== 1 ? "s" : ""} detected in the last 30 days
            </p>
            <p className="text-xs text-[var(--teal)] mt-2 flex items-center gap-1.5">
              <span className="border border-[var(--teal-glow)] bg-[var(--teal-dim)] rounded-full w-4 h-4 flex items-center justify-center shrink-0 font-mono font-bold">i</span>
              Business Impact: Fixing these root causes prevents future tickets and saves support engineering hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="filter-select"
            >
              {serviceOptions.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All Services" : s}
                </option>
              ))}
            </select>
            <select
              value={bucketFilter}
              onChange={(e) => setBucketFilter(e.target.value)}
              className="filter-select"
            >
              {bucketOptions.map((b) => (
                <option key={b} value={b}>
                  {b === "all" ? "All Patterns" : b}
                </option>
              ))}
            </select>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="filter-select"
            >
              <option value="frequency">Sort: Frequency</option>
              <option value="trend_delta">Sort: Trend</option>
              <option value="last_seen">Sort: Last Seen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden animate-in animate-in-delay-1">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Service</th>
                <th>Pattern</th>
                <th>Frequency</th>
                <th className="text-right">Trend</th>
                <th>Last Seen</th>
                <th>Sample Ticket</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={`${row.signature}-${idx}`}>
                  <td>
                    <span
                      className="category-chip"
                      data-cat={row.category.toLowerCase()}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: CATEGORY_COLORS[row.category] ?? "var(--text-muted)" }}
                      />
                      {row.category}
                    </span>
                  </td>
                  <td className="text-[var(--text-primary)] font-medium text-[13px]">
                    {row.service}
                  </td>
                  <td>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                      {row.keyword_bucket}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <div className="freq-bar-track flex-1">
                        <div
                          className="freq-bar-fill"
                          style={{ width: `${(row.frequency / maxFreq) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-semibold text-[var(--text-primary)] w-5 text-right">
                        {row.frequency}
                      </span>
                    </div>
                  </td>
                  <td className="text-right">
                    <span
                      className={
                        row.trend_delta > 0
                          ? "trend-up"
                          : row.trend_delta < 0
                            ? "trend-down"
                            : "trend-flat"
                      }
                    >
                      {row.trend_delta > 0 ? `▲ +${row.trend_delta}` : row.trend_delta < 0 ? `▼ ${row.trend_delta}` : "—"}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {row.last_seen}
                    </span>
                  </td>
                  <td>
                    <div>
                      <span className="text-xs font-mono font-semibold text-[var(--teal)]">
                        {row.sample_ticket_ids[0] ?? "—"}
                      </span>
                      {row.sample_titles[0] && (
                        <p className="text-[11px] text-[var(--text-muted)] truncate max-w-[200px] mt-0.5">
                          {row.sample_titles[0]}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[var(--text-muted)]">
                    No patterns match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
