type Status =
  | "healthy"
  | "warning"
  | "critical"
  | "offline"
  | "open"
  | "resolved"
  | "investigating"
  | "contained";

const STATUS_CLASSES: Record<Status, string> = {
  healthy:
    "border-[rgba(34,197,94,0.28)] bg-[rgba(34,197,94,0.12)] text-[var(--nexus-green-bright)]",
  warning:
    "border-[rgba(245,158,11,0.28)] bg-[rgba(245,158,11,0.12)] text-[var(--nexus-warning-bright)]",
  critical:
    "border-[rgba(239,68,68,0.28)] bg-[rgba(239,68,68,0.14)] text-[var(--nexus-red)]",
  offline:
    "border-[var(--nexus-border-subtle)] bg-[rgba(220,255,220,0.08)] text-[var(--nexus-text-muted)]",
  open: "border-[rgba(56,189,248,0.28)] bg-[rgba(56,189,248,0.12)] text-[var(--nexus-blue)]",
  resolved:
    "border-[rgba(34,197,94,0.28)] bg-[rgba(34,197,94,0.12)] text-[var(--nexus-green-bright)]",
  investigating:
    "border-[rgba(168,85,247,0.28)] bg-[rgba(168,85,247,0.12)] text-[var(--nexus-purple)]",
  contained:
    "border-[rgba(255,238,170,0.28)] bg-[rgba(255,238,170,0.12)] text-[var(--nexus-gold)]",
};

export function StatusBadge({
  status,
  label,
}: {
  status: Status;
  label?: string;
}) {
  return (
    <span
      className={[
        "inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase leading-5 tracking-[0.12em]",
        STATUS_CLASSES[status],
      ].join(" ")}
    >
      <span className="inline-flex h-2 w-2 rounded-full bg-current" />
      {label ?? status}
    </span>
  );
}
