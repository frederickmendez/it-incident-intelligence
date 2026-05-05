import { formatDate } from "@/lib/shared/formatDate";
import {
  type AccentTone,
  ModuleIcon,
  type ModuleVisualKey,
  StatusHalo,
  getModuleVisualKey,
} from "./nexus-visuals";

type PulseEvent = {
  id: string;
  timestamp: string;
  message: string;
};

type PulseView = {
  source: string;
  status: string;
  headline: string;
  detail: string;
  moduleKey: ModuleVisualKey;
  tone: AccentTone;
};

export function SecurityPulseWidget({
  events,
}: {
  events: PulseEvent[];
}) {
  return (
    <div className="space-y-3 rounded-[1rem] border border-[var(--nexus-border-subtle)] bg-[rgba(0,0,0,0.32)] p-4">
      {events.map((event) => {
        const view = buildPulseView(event);

        return (
          <article
            key={event.id}
            className="rounded-[1rem] border border-[rgba(34,197,94,0.08)] bg-[linear-gradient(180deg,rgba(34,197,94,0.06),rgba(3,8,5,0.65))] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <ModuleIcon
                  moduleKey={view.moduleKey}
                  tone={view.tone}
                  size="sm"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[rgba(220,255,220,0.08)] bg-[rgba(220,255,220,0.04)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--nexus-text-soft)]">
                      {view.source}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--nexus-text-muted)]">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                  <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--nexus-green-pale)]">
                    {view.headline}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--nexus-text-soft)]">
                    {view.detail}
                  </p>
                </div>
              </div>
              <StatusHalo tone={view.tone} label={view.status} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

function buildPulseView(event: PulseEvent): PulseView {
  const parts = event.message.trim().split(/\s+/);
  const source = parts[0] ?? "Pulse";
  const second = parts[1] ?? "active";
  const remainder = parts.slice(2).join(" ") || event.message;
  const normalized = event.message.toLowerCase();

  if (source.startsWith("ALERT")) {
    return {
      source,
      status: second,
      headline: remainder,
      detail: "Sentinel Insight surfaced a live detection stream item requiring analyst review.",
      moduleKey: getModuleVisualKey("sentinel-insight"),
      tone: second.toLowerCase() === "resolved" ? "green" : "red",
    };
  }

  if (source.startsWith("LOG-")) {
    return {
      source,
      status: second,
      headline: remainder,
      detail: "MDM Security captured suspicious endpoint activity inside the current scenario snapshot.",
      moduleKey: getModuleVisualKey("mdm-security"),
      tone:
        second.toLowerCase() === "critical"
          ? "red"
          : second.toLowerCase() === "high"
            ? "purple"
            : "orange",
    };
  }

  return {
    source,
    status: normalized.includes("urgent") ? "watch" : "active",
    headline: event.message,
    detail: "Cross-module operational pulse for the current executive scenario.",
    moduleKey: getModuleVisualKey("global"),
    tone: "green" as const,
  };
}
