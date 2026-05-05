export function BarChart({
  items,
  valueFormatter = (value) => String(value),
}: {
  items: Array<{ label: string; value: number; color?: string }>;
  valueFormatter?: (value: number) => string;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[var(--nexus-text-soft)]">
              {item.label}
            </span>
            <span className="font-mono text-[12px] text-[var(--nexus-green-pale)]">
              {valueFormatter(item.value)}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-[rgba(220,255,220,0.08)]">
            <div
              className="h-2.5 rounded-full"
              style={{
                width: `${(item.value / max) * 100}%`,
                background:
                  item.color ??
                  "linear-gradient(90deg, var(--nexus-green), var(--nexus-blue))",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
