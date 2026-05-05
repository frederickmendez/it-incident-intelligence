import {
  AccentBars,
} from "@/components/shared/nexus-visuals";

const STATUS_STYLES = {
  healthy: {
    tone: "green" as const,
    summary: "Stable signal",
    border: "border-[rgba(34,197,94,0.22)]",
    surface:
      "bg-[linear-gradient(135deg,rgba(34,197,94,0.08),rgba(4,10,6,0.56))]",
    badge:
      "border-[rgba(34,197,94,0.22)] bg-[rgba(34,197,94,0.08)] text-[var(--nexus-green-bright)]",
    rail: "bg-[rgba(34,197,94,0.75)]",
  },
  warning: {
    tone: "orange" as const,
    summary: "Watch closely",
    border: "border-[rgba(245,158,11,0.22)]",
    surface:
      "bg-[linear-gradient(135deg,rgba(245,158,11,0.08),rgba(4,10,6,0.56))]",
    badge:
      "border-[rgba(245,158,11,0.22)] bg-[rgba(245,158,11,0.08)] text-[var(--nexus-warning-bright)]",
    rail: "bg-[rgba(245,158,11,0.75)]",
  },
  critical: {
    tone: "red" as const,
    summary: "Immediate action",
    border: "border-[rgba(239,68,68,0.22)]",
    surface:
      "bg-[linear-gradient(135deg,rgba(239,68,68,0.08),rgba(4,10,6,0.56))]",
    badge:
      "border-[rgba(239,68,68,0.22)] bg-[rgba(239,68,68,0.08)] text-[var(--nexus-red)]",
    rail: "bg-[rgba(239,68,68,0.75)]",
  },
  offline: {
    tone: "blue" as const,
    summary: "Signal missing",
    border: "border-[rgba(56,189,248,0.18)]",
    surface:
      "bg-[linear-gradient(135deg,rgba(56,189,248,0.08),rgba(4,10,6,0.56))]",
    badge:
      "border-[rgba(56,189,248,0.18)] bg-[rgba(56,189,248,0.08)] text-[var(--nexus-blue)]",
    rail: "bg-[rgba(56,189,248,0.75)]",
  },
};

export function HexGrid({
  nodes,
}: {
  nodes: Array<{
    id: string;
    label: string;
    status: "healthy" | "warning" | "critical" | "offline";
  }>;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {nodes.map((node, index) => {
        const style = STATUS_STYLES[node.status];

        return (
          <article
            key={node.id}
            className={[
              "group relative overflow-hidden rounded-[1.15rem] border px-4 py-4 shadow-[var(--panel-glow)] transition duration-200 hover:border-[var(--nexus-border-hover)] hover:shadow-[var(--floating-glow)]",
              style.border,
              style.surface,
            ].join(" ")}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,255,220,0.05),transparent_38%)]" />
            <div
              className={[
                "absolute inset-y-4 left-0 w-[3px] rounded-r-full",
                style.rail,
              ].join(" ")}
            />

            <div className="relative flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--nexus-text-muted)]">
                    Node {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-base font-semibold text-[var(--nexus-text)]">
                    {node.label}
                  </p>
                  <p className="mt-1 text-sm text-[var(--nexus-text-soft)]">
                    {style.summary}
                  </p>
                </div>

                <span
                  className={[
                    "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
                    style.badge,
                  ].join(" ")}
                >
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-current" />
                  {node.status}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-[rgba(220,255,220,0.08)] pt-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--nexus-text-muted)]">
                  Live signal
                </p>
                <AccentBars
                  tone={style.tone}
                  bars={[22 + index * 2, 34 + index * 2, 48, 62]}
                />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
