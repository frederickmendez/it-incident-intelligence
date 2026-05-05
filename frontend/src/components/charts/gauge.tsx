"use client";

type Props = {
  score: number;
  size?: number;
  strokeWidth?: number;
};

function scoreColor(score: number): string {
  if (score >= 80) return "var(--rose)";
  if (score >= 65) return "var(--amber)";
  if (score >= 45) return "var(--sky)";
  return "var(--emerald)";
}

export function Gauge({ score, size = 52, strokeWidth = 5 }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const dashOffset = circumference * (1 - pct);
  const color = scoreColor(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-elevated)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}
        />
      </svg>
      <span
        className="absolute text-[11px] font-mono font-bold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}
