export function DonutChart({
  segments,
  centerLabel,
  centerValue,
  size = 220,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
  centerLabel: string;
  centerValue: string;
  size?: number;
}) {
  const total = Math.max(
    segments.reduce((sum, segment) => sum + segment.value, 0),
    1
  );
  const radius = size / 2 - 14;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(220,255,220,0.08)"
            strokeWidth="16"
          />
          {segments.map((segment) => {
            const segmentLength = (segment.value / total) * circumference;
            const dashArray = `${segmentLength} ${circumference - segmentLength}`;
            const dashOffset = -offset;
            offset += segmentLength;

            return (
              <circle
                key={segment.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="16"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--nexus-text-muted)]">
            {centerLabel}
          </p>
          <p className="mt-2 text-3xl font-semibold text-[var(--nexus-text)]">
            {centerValue}
          </p>
        </div>
      </div>
      <div className="grid w-full gap-2">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center justify-between gap-3 rounded-full border border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.58)] px-3 py-2">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex h-2.5 w-2.5 rounded-full"
                style={{ background: segment.color }}
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--nexus-text-soft)]">
                {segment.label}
              </span>
            </div>
            <span className="font-mono text-[12px] text-[var(--nexus-green-pale)]">
              {segment.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
