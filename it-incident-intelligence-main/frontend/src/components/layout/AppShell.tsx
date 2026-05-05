"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { CommandConsole } from "@/components/shared/CommandConsole";
import type { EnvironmentScenario } from "@/lib/shared/environment-scenario";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export type AppShellProps = {
  children: ReactNode;
  moduleTitle: string;
  moduleEyebrow: string;
  globalRiskScore: number;
  globalRiskLevel: "low" | "medium" | "high" | "critical";
  lastUpdated: string;
  currentScenario: EnvironmentScenario;
};

export function AppShell({
  children,
  moduleTitle,
  moduleEyebrow,
  globalRiskScore,
  globalRiskLevel,
  lastUpdated,
  currentScenario,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--nexus-bg)] text-[var(--nexus-text)]">
      <div className="relative lg:flex">
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          currentScenario={currentScenario}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <div
          className="flex min-h-screen min-w-0 flex-1 flex-col"
          style={
            {
              "--shell-sidebar-width": collapsed ? "5.5rem" : "17rem",
            } as CSSProperties
          }
        >
          <Topbar
            collapsed={collapsed}
            moduleTitle={moduleTitle}
            moduleEyebrow={moduleEyebrow}
            globalRiskScore={globalRiskScore}
            globalRiskLevel={globalRiskLevel}
            lastUpdated={lastUpdated}
            currentScenario={currentScenario}
            onOpenMobile={() => setMobileOpen(true)}
            onToggleCollapse={() => setCollapsed((value) => !value)}
          />
          <main className="min-w-0 flex-1 px-4 pb-4 pt-4 sm:px-5 lg:px-8 lg:pb-6 lg:pt-6">
            {children}
          </main>
          <div className="px-4 pb-4 sm:px-5 lg:px-8 lg:pb-6">
            <CommandConsole />
          </div>
        </div>
      </div>
    </div>
  );
}
