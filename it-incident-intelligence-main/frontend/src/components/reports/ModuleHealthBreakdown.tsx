import {
  AccentBars,
  StatusHalo,
} from "@/components/shared/nexus-visuals";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { ModuleHealthItem } from "@/lib/shared/dashboard-summary";

const STATUS_TONES = {
  healthy: "green",
  warning: "orange",
  critical: "red",
  offline: "blue",
} as const;

export function ModuleHealthBreakdown({
  modules,
}: {
  modules: ModuleHealthItem[];
}) {
  return (
    <div className="space-y-3">
      {modules.map((module, index) => {
        const tone = STATUS_TONES[module.status];

        return (
          <div
            key={module.key}
            className="rounded-[1rem] border border-[var(--nexus-border-subtle)] bg-[linear-gradient(135deg,rgba(34,197,94,0.08),rgba(4,10,6,0.62))] px-4 py-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
                    {module.key}
                  </p>
                  <StatusHalo
                    tone={tone}
                    label={`Lane ${String(index + 1).padStart(2, "0")}`}
                  />
                </div>
                <p className="mt-2 text-sm font-semibold text-[var(--nexus-text)]">
                  {module.label}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--nexus-text-soft)]">
                  {module.summary}
                </p>
              </div>
              <StatusBadge status={module.status} />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 rounded-[0.95rem] border border-[rgba(220,255,220,0.08)] bg-[rgba(220,255,220,0.03)] px-3 py-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--nexus-text-muted)]">
                Operational cue
              </p>
              <AccentBars
                tone={tone}
                bars={[26 + index * 4, 44 + index * 5, 38 + index * 3, 68]}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
