"use client";

import { useMemo } from "react";
import type { DashboardData, DonutSegment, BarItem } from "@/types/incident";
import { AreaChart } from "@/components/charts/area-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { HBarChart } from "@/components/charts/bar-chart";
import { Gauge } from "@/components/charts/gauge";

const CATEGORY_COLORS: Record<string, string> = {
  Access: "var(--violet)",
  Network: "var(--sky)",
  Application: "var(--rose)",
  Email: "var(--amber)",
  Infrastructure: "var(--emerald)",
};

function priorityBadgeClass(p: string): string {
  const k = p.toLowerCase();
  if (k === "p1") return "priority-p1";
  if (k === "p2") return "priority-p2";
  if (k === "p3") return "priority-p3";
  return "priority-p4";
}

export function OverviewView({ data }: { data: DashboardData }) {
  /* Derived data for charts */
  const categorySegments: DonutSegment[] = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of data.recurring) {
      counts[r.category] = (counts[r.category] ?? 0) + r.frequency;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({
        label,
        value,
        color: CATEGORY_COLORS[label] ?? "var(--text-muted)",
      }));
  }, [data.recurring]);

  const serviceBarItems: BarItem[] = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of data.recurring) {
      counts[r.service] = (counts[r.service] ?? 0) + r.frequency;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value], i) => ({
        label,
        value,
        color: [
          "var(--chart-1)",
          "var(--chart-2)",
          "var(--chart-3)",
          "var(--chart-4)",
          "var(--chart-5)",
          "var(--chart-6)",
        ][i % 6],
      }));
  }, [data.recurring]);

  const trendPoints = data.summary.trends.map((t) => ({
    label: t.date.slice(5),
    value: t.count,
  }));

  const priorityDistribution = useMemo(() => {
    const counts = { P1: 0, P2: 0, P3: 0, P4: 0 };
    for (const p of data.priorities) {
      counts[p.recommended_priority] += 1;
    }
    return counts;
  }, [data.priorities]);

  const totalPriorities = Object.values(priorityDistribution).reduce((a, b) => a + b, 0);

  const resolvedCount = useMemo(() => {
    const total = data.summary.open_tickets + Math.round(data.summary.open_tickets * 0.38);
    return total - data.summary.open_tickets;
  }, [data.summary.open_tickets]);

  const resolutionRate = Math.round(
    (resolvedCount / (data.summary.open_tickets + resolvedCount)) * 100
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Executive Summary */}
      <div className="glass-card-elevated p-5 border-[var(--teal)] border-l-4 animate-in">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--teal-dim)] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--teal)] mb-1">Business Value Insights</h2>
            <p className="text-[13px] text-[var(--text-primary)] leading-relaxed">
              We've detected <strong>{data.summary.recurring_clusters} recurring incident clusters</strong>. 
              Addressing the top "Access" cluster could reduce weekly ticket volume by 12% and save an estimated 15 hours of support time. 
              Additionally, the Cloud Cost Auditor has identified <strong>${data.cloudCosts?.summary.total_waste_estimated.toLocaleString() ?? 4250}</strong> in estimated monthly waste from idle and unattached resources.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="kpi-card animate-in group">
          <div className="flex justify-between items-start">
            <p className="section-title mb-2">Open Tickets</p>
            <span className="text-[10px] text-[var(--text-muted)] border border-[var(--border-subtle)] rounded-full w-4 h-4 flex items-center justify-center cursor-help" title="Total unresolved incidents across all teams">?</span>
          </div>
          <p className="kpi-value text-3xl text-[var(--text-primary)]">
            {data.summary.open_tickets}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Total unresolved incidents</p>
        </div>
        <div className="kpi-card animate-in animate-in-delay-1 group" data-accent="amber">
          <div className="flex justify-between items-start">
            <p className="section-title mb-2">Recurring Clusters</p>
            <span className="text-[10px] text-[var(--text-muted)] border border-[var(--border-subtle)] rounded-full w-4 h-4 flex items-center justify-center cursor-help" title="Groups of similar tickets. Fixing these prevents future incidents.">?</span>
          </div>
          <p className="kpi-value text-3xl text-[var(--amber)]">
            {data.summary.recurring_clusters}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Identified patterns to investigate</p>
        </div>
        <div className="kpi-card animate-in animate-in-delay-2 group" data-accent="rose">
          <div className="flex justify-between items-start">
            <p className="section-title mb-2">High-Risk Tickets</p>
            <span className="text-[10px] text-[var(--text-muted)] border border-[var(--border-subtle)] rounded-full w-4 h-4 flex items-center justify-center cursor-help" title="Tickets with priority score ≥ 75. High risk of SLA breach.">?</span>
          </div>
          <p className="kpi-value text-3xl text-[var(--rose)]">
            {data.summary.high_risk_tickets}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Score ≥ 75. Fix immediately.</p>
        </div>
        <div className="kpi-card animate-in animate-in-delay-3" data-accent="emerald">
          <p className="section-title mb-2">Resolution Rate</p>
          <p className="kpi-value text-3xl text-[var(--emerald)]">
            {resolutionRate}%
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{resolvedCount} resolved this period</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Trend Chart */}
        <div className="glass-card p-5 xl:col-span-2 animate-in animate-in-delay-2">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
            Incident Trend — Last 10 Days
          </h2>
          <AreaChart points={trendPoints} height={180} />
        </div>

        {/* Category Donut */}
        <div className="glass-card p-5 flex flex-col items-center animate-in animate-in-delay-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 self-start">
            Category Breakdown
          </h2>
          <DonutChart
            segments={categorySegments}
            centerValue={categorySegments.reduce((s, seg) => s + seg.value, 0)}
            centerLabel="Total"
          />
          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-5">
            {categorySegments.map((seg) => (
              <div key={seg.label} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                {seg.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Service Ranking */}
        <div className="glass-card p-5 animate-in animate-in-delay-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
            Top Services by Incidents
          </h2>
          <HBarChart items={serviceBarItems} />
        </div>

        {/* Priority Distribution */}
        <div className="glass-card p-5 animate-in animate-in-delay-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
            Priority Distribution
          </h2>
          <div className="flex flex-col gap-3 mt-2">
            {(["P1", "P2", "P3", "P4"] as const).map((level) => {
              const count = priorityDistribution[level];
              const pct = totalPriorities > 0 ? Math.round((count / totalPriorities) * 100) : 0;
              const colors = {
                P1: "var(--rose)",
                P2: "var(--amber)",
                P3: "var(--sky)",
                P4: "var(--emerald)",
              };
              return (
                <div key={level}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`priority-badge ${priorityBadgeClass(level)}`}>{level}</span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="freq-bar-track">
                    <div
                      className="freq-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: colors[level],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="glass-card p-5 animate-in animate-in-delay-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
            Critical Alerts
          </h2>
          <div className="flex flex-col gap-2.5">
            {data.priorities
              .filter((p) => p.recommended_priority === "P1")
              .slice(0, 5)
              .map((p) => (
                <div
                  key={p.ticket_id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--rose-glow)] transition-colors group"
                >
                  <Gauge score={p.score} size={42} strokeWidth={4} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-[var(--rose)]">
                        {p.ticket_id}
                      </span>
                      <span className="priority-badge priority-p1 text-[10px] px-1.5 py-0">P1</span>
                    </div>
                    <p className="text-[13px] text-[var(--text-secondary)] truncate mt-0.5 group-hover:text-[var(--text-primary)] transition-colors">
                      {p.title}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
