import { AppShell } from "@/components/layout/AppShell";
import { TicketClassifierDashboard } from "@/components/ticket-classifier/TicketClassifierDashboard";
import { normalizeEnvironmentScenario } from "@/lib/shared/environment-scenario";
import { getDashboardSummary } from "@/lib/shared/dashboard-summary";

export default async function TicketClassifierPage({
  searchParams,
}: {
  searchParams?: Promise<{ env?: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const scenario = normalizeEnvironmentScenario(resolvedSearchParams?.env);
  const summary = getDashboardSummary(scenario);

  return (
    <AppShell
      moduleTitle="Ticket Classifier"
      moduleEyebrow="Operations"
      globalRiskScore={summary.globalRiskScore}
      globalRiskLevel={summary.globalRiskLevel}
      lastUpdated={new Date().toISOString()}
      currentScenario={scenario}
    >
      <TicketClassifierDashboard analysis={summary.tickets} />
    </AppShell>
  );
}
