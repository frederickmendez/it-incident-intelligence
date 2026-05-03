import type { DashboardData } from "@/types/incident";
import { HBarChart } from "@/components/charts/bar-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { formatCloudCostViewModel } from "@/lib/cloud-cost/formatter";

export function CloudCostView({ data }: { data: DashboardData }) {
  const costs = data.cloudCosts;
  if (!costs) return null;

  const viewModel = formatCloudCostViewModel(costs);
  const { summary, resources } = viewModel;

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-card-elevated p-5 border-[var(--emerald)] border-l-4 animate-in">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--emerald-dim)] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--emerald)] mb-1">Financial Value: Cloud Cost Auditor</h2>
            <p className="text-[13px] text-[var(--text-primary)] leading-relaxed">
              We've identified <strong>${summary.total_waste_estimated.toLocaleString()}</strong> in estimated monthly waste across your cloud providers.
              Cleaning up the <strong>{summary.idle_resources_count} idle</strong> and <strong>{summary.unattached_resources_count} unattached</strong> resources below will immediately reduce operational spend without impacting performance.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="glass-card p-5 animate-in animate-in-delay-1">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Estimated Waste by Service ($)</h3>
          <HBarChart items={viewModel.topWastedServices} />
        </div>

        <div className="glass-card p-5 flex flex-col items-center justify-center animate-in animate-in-delay-2">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 self-start">Resource Status</h3>
          <DonutChart
            segments={viewModel.statusSegments}
            centerValue={resources.length}
            centerLabel="Flagged"
            size={160}
          />
        </div>

        <div className="glass-card p-5 animate-in animate-in-delay-3 flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Optimization Tips</h3>
          <ul className="text-xs text-[var(--text-secondary)] space-y-3">
            {viewModel.optimizationTips.map((tip) => (
              <li key={tip.label} className="flex gap-2">
                <span
                  className="mt-1 h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ background: tip.color }}
                />
                <span><strong>{tip.label}:</strong> {tip.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass-card overflow-hidden animate-in animate-in-delay-4">
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Optimization Candidates</h3>
          <span className="text-xs text-[var(--text-muted)]">{resources.length} resources flagged</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Resource ID</th>
                <th>Provider / Service</th>
                <th>Type</th>
                <th>Status</th>
                <th className="text-right">Monthly Cost</th>
                <th>Reason Flagged</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((res) => (
                <tr key={res.id}>
                  <td className="font-mono text-[12px] font-semibold text-[var(--text-primary)]">{res.id}</td>
                  <td>
                    <span className="text-[13px]">{res.provider}</span>
                    <span className="text-[var(--text-muted)] mx-1">/</span>
                    <span className="text-[13px] text-[var(--text-secondary)]">{res.service}</span>
                  </td>
                  <td className="font-mono text-[12px] text-[var(--text-secondary)]">{res.type}</td>
                  <td>
                    <span className={`priority-badge ${res.statusBadgeClass}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="text-right text-[13px] font-mono font-semibold text-[var(--text-primary)]">
                    ${res.monthly_cost.toFixed(2)}
                  </td>
                  <td className="text-[12px] text-[var(--text-muted)] max-w-xs truncate">
                    {res.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
