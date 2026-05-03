import { DashboardShell } from "@/components/dashboard-shell";
import { ExecutiveOverview } from "@/components/overview/executive-overview";
import { AppShell } from "@/components/shared/app-shell";
import { getDashboardData } from "@/lib/api";
import { buildExecutiveDashboardSummary } from "@/lib/shared/dashboard-summary";
import { normalizeRootDashboardView } from "@/lib/shared/root-dashboard-view";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ view?: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const activeView = normalizeRootDashboardView(resolvedSearchParams?.view);

  if (activeView === "overview") {
    const summary = buildExecutiveDashboardSummary();

    return (
      <AppShell activeNavKey="overview" dataSource="mock">
        <ExecutiveOverview summary={summary} />
      </AppShell>
    );
  }

  const data = await getDashboardData();

  return <DashboardShell data={data} activeView={activeView} />;
}
