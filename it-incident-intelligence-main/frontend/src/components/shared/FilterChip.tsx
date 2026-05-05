export function FilterChip({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em]",
        active
          ? "border-[var(--nexus-border-active)] bg-[var(--nexus-ghost)] text-[var(--nexus-green-bright)]"
          : "border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.54)] text-[var(--nexus-text-muted)]",
      ].join(" ")}
    >
      {label}
    </span>
  );
}
