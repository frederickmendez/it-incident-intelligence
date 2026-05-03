"use client";

import type { BarItem } from "@/types/incident";

type Props = {
  items: BarItem[];
  maxValue?: number;
  barHeight?: number;
};

export function HBarChart({ items, maxValue, barHeight = 26 }: Props) {
  const max = maxValue ?? Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, idx) => {
        const pct = Math.round((item.value / max) * 100);
        const color = item.color ?? "var(--teal)";
        return (
          <div key={item.label} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                {item.label}
              </span>
              <span
                className="text-[12px] font-mono font-semibold"
                style={{ color }}
              >
                {item.value}
              </span>
            </div>
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: barHeight > 16 ? 8 : 6, background: "var(--bg-elevated)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}88)`,
                  animationDelay: `${idx * 80}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
