"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RiskBadge } from "@/components/shared/RiskBadge";
import {
  ENVIRONMENT_SCENARIOS,
  type EnvironmentScenario,
  getEnvironmentScenarioMeta,
  withEnvironmentScenario,
} from "@/lib/shared/environment-scenario";

export function Topbar({
  collapsed,
  moduleTitle,
  moduleEyebrow,
  globalRiskScore,
  globalRiskLevel,
  lastUpdated,
  currentScenario,
  onOpenMobile,
  onToggleCollapse,
}: {
  collapsed: boolean;
  moduleTitle: string;
  moduleEyebrow: string;
  globalRiskScore: number;
  globalRiskLevel: "low" | "medium" | "high" | "critical";
  lastUpdated: string;
  currentScenario: EnvironmentScenario;
  onOpenMobile: () => void;
  onToggleCollapse: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const scenarioMeta = getEnvironmentScenarioMeta(currentScenario);
  const formattedUpdated = useMemo(
    () =>
      new Date(lastUpdated).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [lastUpdated]
  );

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--nexus-border-subtle)] bg-[var(--nexus-overlay)]/88 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobile}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--nexus-border-subtle)] bg-[var(--nexus-panel)] text-[var(--nexus-green-pale)] transition hover:border-[var(--nexus-border-hover)] hover:bg-[var(--nexus-panel-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nexus-green-bright)] lg:hidden"
            aria-label="Open navigation"
          >
            <MenuIcon />
          </button>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-[var(--nexus-border-subtle)] bg-[var(--nexus-panel)] text-[var(--nexus-green-pale)] transition hover:border-[var(--nexus-border-hover)] hover:bg-[var(--nexus-panel-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nexus-green-bright)] lg:inline-flex"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          >
            {collapsed ? <PanelExpandIcon /> : <PanelCollapseIcon />}
          </button>
          <div>
            <p className="break-words font-mono text-[10px] uppercase leading-5 tracking-[0.14em] text-[var(--nexus-text-muted)]">
              {moduleEyebrow}
            </p>
            <h2 className="break-words font-heading text-xl leading-7 text-[var(--nexus-text)] sm:text-2xl">
              {moduleTitle}
            </h2>
          </div>
        </div>

        <div className="flex min-w-0 flex-wrap items-center justify-start gap-2 lg:justify-end">
          <div className="flex min-w-0 items-center gap-2 rounded-lg border border-[var(--nexus-border-subtle)] bg-[var(--nexus-panel)] px-3 py-2 font-mono text-[11px] uppercase leading-5 tracking-[0.12em] text-[var(--nexus-green-pale)]">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--nexus-green)] shadow-[var(--glow-green)] animate-pulse" />
            System Heartbeat
          </div>

          <label className="flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-[var(--nexus-border-subtle)] bg-[var(--nexus-panel)] px-3 py-2 font-mono text-[11px] uppercase leading-5 tracking-[0.12em] text-[var(--nexus-text-soft)]">
            Environment
            <select
              value={currentScenario}
              onChange={(event) =>
                router.push(
                  withEnvironmentScenario(
                    pathname,
                    event.target.value as EnvironmentScenario
                  )
                )
              }
              className="min-w-0 max-w-[12rem] rounded-lg border border-[var(--nexus-border-subtle)] bg-[var(--nexus-input)] px-3 py-1 text-[11px] text-[var(--nexus-green-pale)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nexus-green-bright)]"
            >
              {ENVIRONMENT_SCENARIOS.map((scenario) => (
                <option key={scenario.value} value={scenario.value}>
                  {scenario.label}
                </option>
              ))}
            </select>
          </label>

          <div className="min-w-0 rounded-lg border border-[var(--nexus-border-subtle)] bg-[var(--nexus-panel)] px-3 py-2">
            <p className="font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-[var(--nexus-text-muted)]">
              Scenario Mode
            </p>
            <p className="mt-1 font-mono text-[11px] text-[var(--nexus-green-pale)]">
              {scenarioMeta.shortLabel}
            </p>
          </div>

          <div className="min-w-0 rounded-lg border border-[var(--nexus-border-subtle)] bg-[var(--nexus-panel)] px-3 py-2">
            <p className="font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-[var(--nexus-text-muted)]">
              Last Updated
            </p>
            <p className="font-mono text-[11px] text-[var(--nexus-green-pale)]">
              {formattedUpdated}
            </p>
          </div>

          <div className="min-w-0 rounded-lg border border-[var(--nexus-border-subtle)] bg-[var(--nexus-panel)] px-3 py-2">
            <p className="font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-[var(--nexus-text-muted)]">
              Global Risk
            </p>
            <div className="mt-1 flex items-center gap-2">
              <RiskBadge level={globalRiskLevel} label={`Risk ${globalRiskScore}`} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function PanelCollapseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
      <path d="m14 9-3 3 3 3" />
    </svg>
  );
}

function PanelExpandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M15 4v16" />
      <path d="m10 9 3 3-3 3" />
    </svg>
  );
}
