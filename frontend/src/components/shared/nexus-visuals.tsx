export type AccentTone =
  | "green"
  | "blue"
  | "orange"
  | "purple"
  | "red"
  | "gold";

export type ModuleVisualKey =
  | "global"
  | "cloud-cost"
  | "mdm-security"
  | "ticket-classifier"
  | "sentinel-insight"
  | "mdm-compliance"
  | "identity-cleanup"
  | "console";

export function getModuleVisualKey(moduleKey: string): ModuleVisualKey {
  const normalized = moduleKey.trim().toLowerCase();

  switch (normalized) {
    case "cloud":
    case "cloud cost":
    case "cloud-cost":
      return "cloud-cost";
    case "mdm":
    case "mdm security":
    case "mdm-security":
      return "mdm-security";
    case "ticket classifier":
    case "ticket-classifier":
    case "tickets":
      return "ticket-classifier";
    case "sentinel":
    case "sentinel insight":
    case "sentinel-insight":
      return "sentinel-insight";
    case "mdm compliance":
    case "mdm-compliance":
      return "mdm-compliance";
    case "identity":
    case "identity cleanup":
    case "identity-cleanup":
      return "identity-cleanup";
    case "console":
      return "console";
    case "global":
    default:
      return "global";
  }
}

const ACCENT_CLASSES: Record<AccentTone, string> = {
  green:
    "border-[rgba(34,197,94,0.28)] bg-[rgba(34,197,94,0.12)] text-[var(--nexus-green-bright)]",
  blue: "border-[rgba(56,189,248,0.28)] bg-[rgba(56,189,248,0.12)] text-[var(--nexus-blue)]",
  orange:
    "border-[rgba(245,158,11,0.28)] bg-[rgba(245,158,11,0.12)] text-[var(--nexus-warning-bright)]",
  purple:
    "border-[rgba(168,85,247,0.28)] bg-[rgba(168,85,247,0.12)] text-[var(--nexus-purple)]",
  red: "border-[rgba(239,68,68,0.28)] bg-[rgba(239,68,68,0.14)] text-[var(--nexus-red)]",
  gold:
    "border-[rgba(255,238,170,0.28)] bg-[rgba(255,238,170,0.12)] text-[var(--nexus-gold)]",
};

export function ModuleIcon({
  moduleKey,
  tone = "green",
  size = "md",
}: {
  moduleKey: ModuleVisualKey;
  tone?: AccentTone;
  size?: "sm" | "md";
}) {
  const sizeClasses =
    size === "sm"
      ? "h-9 w-9 rounded-xl text-[14px]"
      : "h-11 w-11 rounded-2xl text-[16px]";

  return (
    <span
      className={[
        "inline-flex items-center justify-center border shadow-[var(--panel-glow)]",
        ACCENT_CLASSES[tone],
        sizeClasses,
      ].join(" ")}
    >
      <Glyph moduleKey={moduleKey} />
    </span>
  );
}

export function AccentBars({
  tone = "green",
  bars = [40, 72, 56, 88],
}: {
  tone?: AccentTone;
  bars?: number[];
}) {
  const colorMap: Record<AccentTone, string> = {
    green: "var(--nexus-green)",
    blue: "var(--nexus-blue)",
    orange: "var(--nexus-warning)",
    purple: "var(--nexus-purple)",
    red: "var(--nexus-red)",
    gold: "var(--nexus-gold)",
  };

  return (
    <div className="flex items-end gap-1">
      {bars.map((value, index) => (
        <span
          key={`${tone}-${index}-${value}`}
          className="inline-flex w-1.5 rounded-full bg-[rgba(220,255,220,0.08)]"
          style={{
            height: `${Math.max(10, value / 2)}px`,
            background:
              index === bars.length - 1
                ? colorMap[tone]
                : `${colorMap[tone]}66`,
          }}
        />
      ))}
    </div>
  );
}

export function StatusHalo({
  tone = "green",
  label,
}: {
  tone?: AccentTone;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={[
          "inline-flex h-3 w-3 rounded-full border",
          ACCENT_CLASSES[tone],
        ].join(" ")}
      />
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
        {label}
      </span>
    </div>
  );
}

function Glyph({ moduleKey }: { moduleKey: ModuleVisualKey }) {
  switch (moduleKey) {
    case "cloud-cost":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19a4.5 4.5 0 0 0 1.2-8.83A6 6 0 0 0 7.8 7.2 4.5 4.5 0 0 0 7 19Z" />
          <path d="M12 5v10" />
          <path d="m9.5 11 2.5 2.5 2.5-2.5" />
        </svg>
      );
    case "mdm-security":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="2.5" width="12" height="19" rx="2.2" />
          <path d="M9 6.5h6" />
          <path d="M12 17.5h.01" />
        </svg>
      );
    case "ticket-classifier":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 6h13" />
          <path d="M8 12h13" />
          <path d="M8 18h13" />
          <path d="M3 6h.01" />
          <path d="M3 12h.01" />
          <path d="M3 18h.01" />
        </svg>
      );
    case "sentinel-insight":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s7-3.8 7-10.25V5.7L12 3 5 5.7v5.05C5 17.2 12 21 12 21Z" />
          <path d="m9.5 12.5 1.75 1.75 3.25-4.25" />
        </svg>
      );
    case "mdm-compliance":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11.5 11 13.5 15.5 9" />
          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Z" />
        </svg>
      );
    case "identity-cleanup":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20a8 8 0 0 1 16 0" />
          <path d="M17 7h4" />
        </svg>
      );
    case "console":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 8 4 4-4 4" />
          <path d="M13 16h5" />
          <rect x="2.5" y="4" width="19" height="16" rx="2" />
        </svg>
      );
    case "global":
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
  }
}
