export function ThreatAreaChart({
  points,
}: {
  points: Array<{ label: string; value: number }>;
}) {
  const width = 640;
  const height = 220;
  const padding = 24;
  const max = Math.max(...points.map((point) => point.value), 1);
  const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;

  const coordinates = points.map((point, index) => {
    const x = padding + index * step;
    const y = height - padding - (point.value / max) * (height - padding * 2);
    return { ...point, x, y };
  });

  const line = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const area = `${line} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="space-y-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-56 w-full overflow-visible rounded-[1rem] border border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.44)] p-2"
      >
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={padding}
            x2={width - padding}
            y1={height - padding - ratio * (height - padding * 2)}
            y2={height - padding - ratio * (height - padding * 2)}
            stroke="rgba(220,255,220,0.08)"
            strokeDasharray="4 4"
          />
        ))}
        <defs>
          <linearGradient id="threat-area-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(239,68,68,0.4)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0.02)" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#threat-area-fill)" />
        <path d={line} fill="none" stroke="var(--nexus-green-bright)" strokeWidth="3" />
        {coordinates.map((point) => (
          <circle
            key={point.label}
            cx={point.x}
            cy={point.y}
            r="4.5"
            fill="var(--nexus-bg)"
            stroke="var(--nexus-green-bright)"
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {coordinates.map((point) => (
          <div
            key={point.label}
            className="rounded-xl border border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.58)] px-3 py-2"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
              {point.label}
            </p>
            <p className="mt-1 text-sm text-[var(--nexus-text)]">{point.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
