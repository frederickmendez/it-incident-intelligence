import type { RiskLevel } from "@/lib/shared/riskLevels";
import { RiskBadge } from "./RiskBadge";

type Variant = "green" | "blue" | "orange" | "purple" | "red" | "gold";

const VARIANT_CLASSES: Record<Variant, string> = {
  green: "from-[rgba(34,197,94,0.16)] to-transparent text-[var(--nexus-green-bright)]",
  blue: "from-[rgba(56,189,248,0.16)] to-transparent text-[var(--nexus-blue)]",
  orange: "from-[rgba(245,158,11,0.16)] to-transparent text-[var(--nexus-warning-bright)]",
  purple: "from-[rgba(168,85,247,0.16)] to-transparent text-[var(--nexus-purple)]",
  red: "from-[rgba(239,68,68,0.16)] to-transparent text-[var(--nexus-red)]",
  gold: "from-[rgba(255,238,170,0.16)] to-transparent text-[var(--nexus-gold)]",
};

export function KpiCard({
  label,
  value,
  trend,
  riskLevel,
  description,
  variant,
}: {
  label: string;
  value: string;
  trend?: string;
  riskLevel?: RiskLevel;
  description: string;
  variant: Variant;
}) {
  return (
    <article className="group relative min-w-0 overflow-hidden rounded-lg border border-[var(--nexus-border-subtle)] bg-[var(--nexus-panel)] p-4 shadow-[var(--panel-glow)] transition duration-200 hover:border-[var(--nexus-border-hover)] hover:bg-[var(--nexus-panel-strong)] sm:p-5">
      <div
        className={[
          "pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br opacity-80",
          VARIANT_CLASSES[variant],
        ].join(" ")}
      />
      <div className="relative min-w-0">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 break-words font-mono text-[11px] uppercase leading-5 tracking-[0.14em] text-[var(--nexus-text-muted)]">
            {label}
          </p>
          {riskLevel ? <RiskBadge level={riskLevel} /> : null}
        </div>
        <p className="mt-4 break-words text-2xl font-semibold leading-none text-[var(--nexus-text)] sm:text-3xl">
          {value}
        </p>
        {trend ? (
          <p className="mt-2 break-words font-mono text-[11px] uppercase leading-5 tracking-[0.12em] text-[var(--nexus-green)]">
            {trend}
          </p>
        ) : null}
        <p className="mt-4 text-sm leading-6 text-[var(--nexus-text-soft)]">
          {description}
        </p>
      </div>
    </article>
  );
}
