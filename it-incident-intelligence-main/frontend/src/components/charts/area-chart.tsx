"use client";

import { useState, useId } from "react";

type Point = { label: string; value: number };

type Props = {
  points: Point[];
  width?: number;
  height?: number;
  color?: string;
  showDots?: boolean;
};

export function AreaChart({
  points,
  width = 500,
  height = 160,
  color = "var(--teal)",
  showDots = true,
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (points.length === 0) return null;

  const padX = 32;
  const padTop = 16;
  const padBottom = 28;
  const chartW = width - padX * 2;
  const chartH = height - padTop - padBottom;

  const maxVal = Math.max(...points.map((p) => p.value), 1);
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const coords = points.map((p, i) => ({
    x: padX + (i / (points.length - 1)) * chartW,
    y: padTop + chartH - ((p.value - minVal) / range) * chartH,
    ...p,
  }));

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${padTop + chartH} L ${coords[0].x} ${padTop + chartH} Z`;

  const gridLines = 4;
  const gridValues = Array.from({ length: gridLines + 1 }, (_, i) =>
    Math.round(minVal + (range / gridLines) * i)
  );

  const baseId = useId().replace(/:/g, "");
  const gradientId = `area-grad-${baseId}`;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridValues.map((val, i) => {
          const y = padTop + chartH - ((val - minVal) / range) * chartH;
          return (
            <g key={i}>
              <line
                x1={padX}
                x2={width - padX}
                y1={y}
                y2={y}
                stroke="var(--border-subtle)"
                strokeDasharray="3 3"
              />
              <text
                x={padX - 6}
                y={y + 3}
                textAnchor="end"
                fontSize={10}
                fill="var(--text-muted)"
                fontFamily="var(--font-mono)"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots & hover */}
        {coords.map((c, i) => (
          <g key={i} onMouseEnter={() => setHovered(i)}>
            <circle cx={c.x} cy={c.y} r={16} fill="transparent" />
            {showDots && (
              <circle
                cx={c.x}
                cy={c.y}
                r={hovered === i ? 5 : 3}
                fill={hovered === i ? color : "var(--bg-surface)"}
                stroke={color}
                strokeWidth={2}
                className="transition-all duration-150"
              />
            )}
            {/* X-axis labels */}
            <text
              x={c.x}
              y={height - 6}
              textAnchor="middle"
              fontSize={10}
              fill="var(--text-muted)"
              fontFamily="var(--font-mono)"
            >
              {c.label}
            </text>
          </g>
        ))}

        {/* Hover tooltip vertical line */}
        {hovered !== null && (
          <line
            x1={coords[hovered].x}
            x2={coords[hovered].x}
            y1={padTop}
            y2={padTop + chartH}
            stroke={color}
            strokeWidth={1}
            strokeDasharray="4 3"
            opacity={0.4}
          />
        )}
      </svg>

      {/* Tooltip */}
      {hovered !== null && (
        <div
          className="chart-tooltip absolute z-10 -translate-x-1/2"
          style={{
            left: `${(coords[hovered].x / width) * 100}%`,
            top: `${(coords[hovered].y / height) * 100 - 14}%`,
          }}
        >
          <span className="font-semibold" style={{ color }}>
            {coords[hovered].value}
          </span>
          <span className="ml-1.5 text-[var(--text-muted)]">
            {coords[hovered].label}
          </span>
        </div>
      )}
    </div>
  );
}
