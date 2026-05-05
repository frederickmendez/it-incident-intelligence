export function GaugeChart({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const safeValue = Math.max(0, Math.min(value, 100));
  const radius = 62;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (safeValue / 100) * circumference;
  const color =
    safeValue >= 85
      ? "var(--nexus-red)"
      : safeValue >= 70
        ? "var(--nexus-purple)"
        : safeValue >= 45
          ? "var(--nexus-warning)"
          : "var(--nexus-green)";

  return (
    <div className="flex min-w-0 flex-col items-center overflow-hidden py-2">
      <svg
        width="180"
        height="118"
        viewBox="0 0 180 118"
        className="h-auto w-full max-w-[180px] shrink-0"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M28 92a62 62 0 0 1 124 0"
          fill="none"
          stroke="rgba(220,255,220,0.08)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M28 92a62 62 0 0 1 124 0"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="-mt-6 max-w-full text-center">
        <p className="break-words font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-[var(--nexus-text-muted)]">
          {label}
        </p>
        <p className="mt-1 text-3xl font-semibold leading-none text-[var(--nexus-text)]">
          {safeValue}
        </p>
      </div>
    </div>
  );
}
