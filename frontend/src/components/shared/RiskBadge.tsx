import type { RiskLevel } from "@/lib/shared/riskLevels";

const RISK_CLASSES: Record<RiskLevel, string> = {
  low: "border-[var(--nexus-border-subtle)] bg-[rgba(56,189,248,0.12)] text-[var(--nexus-blue)]",
  medium:
    "border-[rgba(245,158,11,0.28)] bg-[rgba(245,158,11,0.12)] text-[var(--nexus-warning-bright)]",
  high: "border-[rgba(168,85,247,0.28)] bg-[rgba(168,85,247,0.12)] text-[var(--nexus-purple)]",
  critical:
    "border-[rgba(239,68,68,0.28)] bg-[rgba(239,68,68,0.14)] text-[var(--nexus-red)]",
};

export function RiskBadge({
  level,
  label,
}: {
  level: RiskLevel;
  label?: string;
}) {
  return (
    <span
      className={[
        "inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase leading-5 tracking-[0.12em]",
        RISK_CLASSES[level],
      ].join(" ")}
    >
      <span className="inline-flex h-2 w-2 rounded-full bg-current" />
      {label ?? level}
    </span>
  );
}
