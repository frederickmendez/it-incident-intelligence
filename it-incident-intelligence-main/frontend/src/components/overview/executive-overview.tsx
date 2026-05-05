import type { DashboardSummary } from "@/lib/shared/dashboard-summary";
import { OverviewDashboard } from "./OverviewDashboard";

export function ExecutiveOverview({ summary }: { summary: DashboardSummary }) {
  return <OverviewDashboard summary={summary} />;
}
