"use client";

import { useState } from "react";
import type { DashboardData } from "@/types/incident";
import { Gauge } from "@/components/charts/gauge";
import { formatTicketClassifierViewModel } from "@/lib/ticket-classifier/formatter";

function ExpandableReasons({ reasons }: { reasons: string[] }) {
  const [open, setOpen] = useState(false);
  if (reasons.length <= 2 && !open) {
    return (
      <span className="text-xs text-[var(--text-muted)]">
        {reasons.join(" - ")}
      </span>
    );
  }
  return (
    <div>
      <span className="text-xs text-[var(--text-muted)]">
        {open ? reasons.join(" - ") : reasons.slice(0, 2).join(" - ")}
      </span>
      {reasons.length > 2 && (
        <button
          onClick={() => setOpen(!open)}
          className="ml-1.5 text-[11px] font-medium text-[var(--teal)] hover:underline"
        >
          {open ? "less" : `+${reasons.length - 2} more`}
        </button>
      )}
    </div>
  );
}

export function TicketClassifierView({ data }: { data: DashboardData }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const viewModel = formatTicketClassifierViewModel(data.priorities);

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-card p-5 animate-in">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Smart Priority Queue
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">
          {viewModel.ticketCount} tickets automatically ranked by AI.
        </p>
        <p className="text-xs text-[var(--teal)] mt-2 flex items-center gap-1.5 max-w-3xl">
          <span className="border border-[var(--teal-glow)] bg-[var(--teal-dim)] rounded-full w-4 h-4 flex items-center justify-center shrink-0 font-mono font-bold">i</span>
          Scoring Engine: The system calculates a 0-100 risk score based on urgency, business impact, and how critical the affected service is. Higher scores require immediate attention.
        </p>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
        <div className="glass-card overflow-hidden 2xl:col-span-2 animate-in animate-in-delay-1">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-14">Score</th>
                  <th>Ticket</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Reasoning</th>
                </tr>
              </thead>
              <tbody>
                {viewModel.rows.map((row) => (
                  <tr
                    key={row.ticket_id}
                    className={expanded === row.ticket_id ? "bg-[var(--bg-hover)]" : ""}
                    onClick={() =>
                      setExpanded(expanded === row.ticket_id ? null : row.ticket_id)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <Gauge score={row.score} size={44} strokeWidth={4} />
                    </td>
                    <td>
                      <div>
                        <span className="text-[13px] font-mono font-semibold text-[var(--text-primary)]">
                          {row.ticket_id}
                        </span>
                        <p className="text-[12px] text-[var(--text-muted)] mt-0.5 max-w-[220px] truncate">
                          {row.title}
                        </p>
                      </div>
                    </td>
                    <td className="text-[var(--text-secondary)] text-[13px]">
                      {row.service}
                    </td>
                    <td>
                      <span className="flex items-center gap-1.5 text-xs">
                        <span
                          className={`status-dot ${row.isOpen ? "live" : ""}`}
                          style={
                            row.isOpen
                              ? undefined
                              : { background: "var(--text-muted)" }
                          }
                        />
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`priority-badge ${row.priorityBadgeClass}`}
                      >
                        {row.recommended_priority}
                      </span>
                    </td>
                    <td>
                      <ExpandableReasons reasons={row.reasons} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-5 animate-in animate-in-delay-2">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
            Risk Hotspots
          </h3>
          <p className="text-xs text-[var(--text-muted)] mb-3">
            Where are the highest risks concentrated right now?
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left text-[var(--text-muted)] font-medium"></th>
                  {viewModel.services.map((service) => (
                    <th
                      key={service}
                      className="p-2 text-center text-[var(--text-muted)] font-medium whitespace-nowrap"
                    >
                      {service.length > 12 ? service.slice(0, 10) + "..." : service}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {viewModel.heatmapRows.map((row) => (
                  <tr key={row.category}>
                    <td className="p-2 text-[var(--text-secondary)] font-medium whitespace-nowrap">
                      {row.category}
                    </td>
                    {row.cells.map((cell) => (
                      <td key={cell.service} className="p-1">
                        <div
                          className="flex items-center justify-center rounded-md h-9 font-mono font-bold text-[11px] transition-all"
                          style={{
                            background: cell.backgroundColor,
                            color: cell.textColor,
                          }}
                        >
                          {cell.displayValue}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-3 mt-4 text-[10px] text-[var(--text-muted)]">
            {viewModel.legendItems.map((item) => (
              <span key={item.label} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded" style={{ background: item.color }} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
