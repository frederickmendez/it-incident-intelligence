import type { DashboardData } from "@/types/incident";
import { CloudCostView } from "@/components/cloud-cost/cloud-cost-view";
import { IncidentsView } from "@/components/incidents-view";
import { OverviewView } from "@/components/overview-view";
import { TicketClassifierView } from "@/components/ticket-classifier/ticket-classifier-view";
import { AppShell } from "@/components/shared/app-shell";
import type { RootDashboardView } from "@/lib/shared/root-dashboard-view";

export function DashboardShell({
  data,
  activeView,
}: {
  data: DashboardData;
  activeView: RootDashboardView;
}) {
  return (
    <AppShell activeNavKey={activeView} dataSource={data.source}>
      {activeView === "overview" && <OverviewView data={data} />}
      {activeView === "reports" && <IncidentsView data={data} />}
      {activeView === "urgent-ticket-classifier" && (
        <TicketClassifierView data={data} />
      )}
      {activeView === "cloud-cost-auditor" && <CloudCostView data={data} />}
    </AppShell>
  );
}
