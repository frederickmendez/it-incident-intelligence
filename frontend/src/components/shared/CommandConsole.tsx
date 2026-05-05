"use client";

import { useMemo, useState } from "react";
import { AccentBars, StatusHalo } from "./nexus-visuals";

const SAMPLE_COMMANDS = [
  "scan cloud waste",
  "isolate device mdm-mac-1001",
  "show p1 tickets",
  "investigate ALERT-2026-00091",
];

export function CommandConsole() {
  const [command, setCommand] = useState("");

  const hint = useMemo(() => {
    if (!command) {
      return "Preview mode only. Use the command surface to demonstrate how an operator would pivot across cloud, endpoint, ticket, and sentinel workflows.";
    }

    return `Preview only: "${command}" is staged as a guided portfolio interaction with no live backend attached.`;
  }, [command]);

  return (
    <section className="relative overflow-hidden rounded-[1.2rem] border border-[var(--nexus-border-focus)] bg-[rgba(2,6,3,0.96)] p-4 shadow-[var(--floating-glow)]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-14 border-r border-[rgba(34,197,94,0.08)] bg-[linear-gradient(180deg,rgba(34,197,94,0.08),transparent)]">
        <div className="flex h-full flex-col items-center justify-between py-4">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--nexus-green)] shadow-[var(--glow-green)]" />
          <AccentBars tone="green" bars={[18, 28, 44, 56]} />
          <span className="h-2.5 w-2.5 rounded-full border border-[rgba(220,255,220,0.16)] bg-[rgba(220,255,220,0.06)]" />
        </div>
      </div>

      <div className="relative pl-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--nexus-text-muted)]">
              Command Console
            </p>
            <h3 className="mt-2 text-base font-semibold text-[var(--nexus-text)]">
              Operator Input Surface
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--nexus-text-soft)]">
              Mission-control shortcuts help frame the suite as an operational workspace for executives, analysts, and response leads.
            </p>
          </div>
          <StatusHalo tone="green" label="Preview active" />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {SAMPLE_COMMANDS.map((sample, index) => (
            <button
              key={sample}
              type="button"
              onClick={() => setCommand(sample)}
              className="group rounded-[0.95rem] border border-[var(--nexus-border-subtle)] bg-[linear-gradient(180deg,rgba(34,197,94,0.08),rgba(4,10,6,0.6))] px-3 py-2 text-left transition hover:border-[var(--nexus-border-hover)] hover:bg-[rgba(34,197,94,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nexus-green-bright)]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
                Cmd {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--nexus-green-pale)] group-hover:text-[var(--nexus-text)]">
                {sample}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-[1rem] border border-[var(--nexus-border-subtle)] bg-black/40 p-3">
          <div className="flex items-center justify-between gap-3 border-b border-[rgba(220,255,220,0.08)] pb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--nexus-green)] shadow-[var(--glow-green)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
                Mock execution channel
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]">
              No live backend
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-[0.95rem] border border-[rgba(34,197,94,0.12)] bg-[rgba(0,0,0,0.45)] px-4 py-3 focus-within:border-[var(--nexus-border-hover)] focus-within:shadow-[var(--glow-green)]">
            <span className="font-mono text-sm text-[var(--nexus-green)]">$</span>
            <input
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              placeholder="Type a mission-control command"
              className="w-full bg-transparent font-mono text-sm text-[var(--nexus-green-pale)] outline-none placeholder:text-[var(--nexus-text-disabled)]"
              aria-label="Mission control command input"
            />
          </div>
        </div>

        <p className="mt-3 font-mono text-[12px] leading-6 text-[var(--nexus-text-soft)]">
          {hint}
        </p>
      </div>
    </section>
  );
}
