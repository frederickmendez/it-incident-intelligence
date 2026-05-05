"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type EnvironmentScenario,
  getEnvironmentScenarioMeta,
  withEnvironmentScenario,
} from "@/lib/shared/environment-scenario";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const PRIMARY_NAV: NavItem[] = [
  { label: "Overview", href: "/", icon: <GridIcon /> },
  { label: "Cloud Cost", href: "/cloud-cost", icon: <CloudIcon /> },
  { label: "MDM Security", href: "/mdm-security", icon: <DeviceIcon /> },
  {
    label: "Ticket Classifier",
    href: "/ticket-classifier",
    icon: <QueueIcon />,
  },
  {
    label: "Sentinel Insight",
    href: "/sentinel-insight",
    icon: <ShieldIcon />,
  },
  { label: "Reports", href: "/reports", icon: <ReportIcon /> },
];

export function Sidebar({
  collapsed,
  mobileOpen,
  currentScenario,
  onCloseMobile,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  currentScenario: EnvironmentScenario;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();
  const scenarioMeta = getEnvironmentScenarioMeta(currentScenario);

  return (
    <>
      {mobileOpen ? (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-[var(--nexus-border-subtle)]",
          "bg-[var(--nexus-overlay)]/95 backdrop-blur-xl transition-transform duration-200 lg:sticky lg:top-0 lg:z-20",
          collapsed ? "w-[5.5rem]" : "w-[17rem]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="border-b border-[var(--nexus-border-subtle)] px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--nexus-border-active)] bg-[var(--nexus-ghost)] shadow-[var(--glow-green)]">
              <GridIcon />
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--nexus-text-muted)]">
                  Nexus IT Suite
                </p>
                <h1 className="truncate font-heading text-2xl text-[var(--nexus-text)]">
                  NexusOps
                </h1>
              </div>
            ) : null}
          </div>
        </div>

        <nav className="flex-1 px-3 py-5">
          <p
            className={[
              "mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--nexus-text-muted)]",
              collapsed ? "px-2 text-center" : "px-3",
            ].join(" ")}
          >
            Modules
          </p>
          <div className="space-y-2">
            {PRIMARY_NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={withEnvironmentScenario(item.href, currentScenario)}
                  onClick={onCloseMobile}
                  className={[
                    "group flex items-center gap-3 rounded-2xl border px-3 py-3 transition duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nexus-green-bright)]",
                    active
                      ? "border-[var(--nexus-border-active)] bg-[var(--nexus-panel-strong)] text-[var(--nexus-green-bright)] shadow-[var(--glow-green)]"
                      : "border-transparent text-[var(--nexus-text-soft)] hover:border-[var(--nexus-border-hover)] hover:bg-[var(--nexus-panel)] hover:text-[var(--nexus-green-pale)]",
                    collapsed ? "justify-center" : "",
                  ].join(" ")}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="text-[var(--nexus-green)] transition group-hover:text-[var(--nexus-green-bright)]">
                    {item.icon}
                  </span>
                  {!collapsed ? (
                    <span className="truncate font-mono text-[12px] uppercase tracking-[0.16em]">
                      {item.label}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[var(--nexus-border-subtle)] px-4 py-4">
          <div className="rounded-2xl border border-[var(--nexus-border-subtle)] bg-[var(--nexus-panel)] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--nexus-text-muted)]">
              Platform
            </p>
            {!collapsed ? (
              <>
            <p className="mt-2 text-sm text-[var(--nexus-text-soft)]">
                  Production-inspired mission control with mock enterprise data.
                </p>
                <p className="mt-2 font-mono text-[11px] text-[var(--nexus-green)]">
                  {scenarioMeta.label.toUpperCase()}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--nexus-text-muted)]">
                  NO LIVE CONNECTORS
                </p>
              </>
            ) : (
              <div className="mt-2 flex justify-center">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--nexus-green)] shadow-[var(--glow-green)]" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19a4.5 4.5 0 0 0 1.2-8.83A6 6 0 0 0 7.8 7.2 4.5 4.5 0 0 0 7 19Z" />
      <path d="M12 9v6" />
      <path d="m9.5 12 2.5 2.5 2.5-2.5" />
    </svg>
  );
}

function DeviceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="2.5" width="12" height="19" rx="2.2" />
      <path d="M9 6.5h6" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}

function QueueIcon() {
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
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-3.8 7-10.25V5.7L12 3 5 5.7v5.05C5 17.2 12 21 12 21Z" />
      <path d="m9.5 12.5 1.75 1.75 3.25-4.25" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  );
}
