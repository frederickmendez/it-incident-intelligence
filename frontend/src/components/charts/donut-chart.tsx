"use client";

import { useState } from "react";
import type { DonutSegment } from "@/types/incident";

type Props = {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string | number;
};

export function DonutChart({
  segments,
  size = 180,
  strokeWidth = 28,
  centerLabel,
  centerValue,
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return null;

  let accumulated = 0;
  const arcs = segments.map((seg, i) => {
    const pct = seg.value / total;
    const dashLength = pct * circumference;
    const dashOffset = -accumulated * circumference;
    accumulated += pct;
    return { ...seg, dashLength, dashOffset, index: i, pct };
  });

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--bg-elevated)"
          strokeWidth={strokeWidth}
        />
        {/* Segments */}
        {arcs.map((arc) => (
          <circle
            key={arc.label}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={hovered === arc.index ? strokeWidth + 4 : strokeWidth}
            strokeDasharray={`${arc.dashLength} ${circumference - arc.dashLength}`}
            strokeDashoffset={arc.dashOffset}
            strokeLinecap="butt"
            className="transition-all duration-200"
            style={{ filter: hovered === arc.index ? `drop-shadow(0 0 6px ${arc.color})` : "none" }}
            onMouseEnter={() => setHovered(arc.index)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {centerValue !== undefined && (
          <span className="text-2xl font-bold text-[var(--text-primary)] font-mono">
            {centerValue}
          </span>
        )}
        {centerLabel && (
          <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5">
            {centerLabel}
          </span>
        )}
      </div>
      {/* Legend */}
      {hovered !== null && (
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full chart-tooltip whitespace-nowrap z-10"
        >
          <span style={{ color: arcs[hovered].color }} className="font-semibold">
            {arcs[hovered].label}
          </span>
          <span className="ml-2 text-[var(--text-secondary)]">
            {arcs[hovered].value} ({Math.round(arcs[hovered].pct * 100)}%)
          </span>
        </div>
      )}
    </div>
  );
}
