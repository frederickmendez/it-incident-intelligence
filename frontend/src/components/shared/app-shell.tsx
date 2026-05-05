"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useState } from "react";
import {
  buildRootDashboardHref,
  type RootDashboardView,
} from "@/lib/shared/root-dashboard-view";

type DataSource = "api" | "mock";

type NavSection = {
  type: "section";
  label: string;
};

type NavItem = {
  type: "item";
  key: string;
  label: string;
  icon: ReactNode;
  href?: string;
  rootView?: RootDashboardView;
  disabled?: boolean;
};

type AppNavEntry = NavSection | NavItem;

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function PriorityIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
      <path d="M6 5h12" />
      <path d="M6 19h12" />
    </svg>
  );
}

function CurrencyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function DeviceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M10 7h4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
      <path d="M19 8v6" />
      <path d="M16 11h6" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 14l3-3 3 2 4-5" />
    </svg>
  );
}

export const APP_NAVIGATION: AppNavEntry[] = [
  {
    type: "item",
    key: "overview",
    label: "Overview",
    icon: <DashboardIcon />,
    href: buildRootDashboardHref("overview"),
    rootView: "overview",
  },
  { type: "section", label: "Operations" },
  {
    type: "item",
    key: "urgent-ticket-classifier",
    label: "Urgent Ticket Classifier",
    icon: <PriorityIcon />,
    href: buildRootDashboardHref("urgent-ticket-classifier"),
    rootView: "urgent-ticket-classifier",
  },
  { type: "section", label: "Cloud / FinOps" },
  {
    type: "item",
    key: "cloud-cost-auditor",
    label: "Cloud Cost Auditor",
    icon: <CurrencyIcon />,
    href: buildRootDashboardHref("cloud-cost-auditor"),
    rootView: "cloud-cost-auditor",
  },
  { type: "section", label: "Endpoint Security" },
  {
    type: "item",
    key: "mdm-security-monitor",
    label: "MDM Security Monitor",
    icon: <DeviceIcon />,
    disabled: true,
  },
  {
    type: "item",
    key: "mdm-compliance-checker",
    label: "MDM Compliance Checker",
    icon: <ShieldIcon />,
    disabled: true,
  },
  { type: "section", label: "Identity Security" },
  {
    type: "item",
    key: "stale-account-cleanup",
    label: "Stale Account Cleanup",
    icon: <UserIcon />,
    href: "/stale-accounts",
  },
  {
    type: "item",
    key: "reports",
    label: "Reports",
    icon: <ReportIcon />,
    href: buildRootDashboardHref("reports"),
    rootView: "reports",
  },
];

function getActiveLabel(activeNavKey: string): string {
  const activeItem = APP_NAVIGATION.find(
    (entry): entry is NavItem =>
      entry.type === "item" && entry.key === activeNavKey
  );

  return activeItem?.label ?? "Overview";
}

export function AppShell({
  children,
  activeNavKey,
  dataSource,
  contentClassName = "flex-1 p-4 md:p-6 overflow-auto",
}: {
  children: ReactNode;
  activeNavKey: string;
  dataSource?: DataSource;
  contentClassName?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const now = new Date();
  const timestamp = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="border-b border-[var(--border-subtle)] p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--teal)] to-[var(--sky)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bg-base)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight text-[var(--text-primary)]">
                Incident IQ
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Intelligence System
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4">
          <p className="section-title mb-2 px-5">Navigation</p>
          {APP_NAVIGATION.map((entry) => {
            if (entry.type === "section") {
              return (
                <p key={entry.label} className="sidebar-nav-section px-5">
                  {entry.label}
                </p>
              );
            }

            const itemClassName = `sidebar-nav-item w-full ${
              activeNavKey === entry.key ? "active" : ""
            } ${entry.disabled ? "disabled" : ""}`;

            if (entry.disabled) {
              return (
                <div
                  key={entry.key}
                  aria-disabled="true"
                  className={itemClassName}
                >
                  {entry.icon}
                  <span>{entry.label}</span>
                </div>
              );
            }

            return (
              <Link
                key={entry.key}
                href={entry.href ?? "#"}
                onClick={() => setSidebarOpen(false)}
                className={itemClassName}
              >
                {entry.icon}
                <span>{entry.label}</span>
              </Link>
            );
          })}
        </nav>

        {dataSource && (
          <div className="border-t border-[var(--border-subtle)] p-4">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <span
                className={`status-dot ${dataSource === "api" ? "live" : "mock"}`}
              />
              <span>{dataSource === "api" ? "Live API" : "Mock Data"}</span>
            </div>
          </div>
        )}
      </aside>

      <div className="flex flex-1 flex-col md:ml-[var(--sidebar-width)]">
        <header className="topbar">
          <button
            className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden items-center gap-2 md:flex">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              {getActiveLabel(activeNavKey)}
            </h2>
            <span className="text-[var(--text-muted)]">·</span>
            <span className="text-xs text-[var(--text-muted)]">
              Operations Command Center
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-xs text-[var(--text-muted)] sm:inline">
              {timestamp} - {time}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--violet)] to-[var(--rose)] text-[11px] font-bold text-white">
              OP
            </div>
          </div>
        </header>

        <div className={contentClassName}>{children}</div>
      </div>
    </div>
  );
}
