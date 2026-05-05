import { riskScoreToLevel } from "@/lib/shared/riskLevels";
import { calculateTicketPriorityScore } from "./scoring";
import type { SupportTicketRecord, TicketClassification, TicketClassifierAnalysis } from "./types";

export function classifySupportTickets(
  tickets: SupportTicketRecord[]
): TicketClassifierAnalysis {
  const items = tickets
    .map((ticket) => classifyTicket(ticket))
    .sort((left, right) => right.priorityScore - left.priorityScore);

  const openItems = items.filter((item) => item.status !== "resolved");
  const p1P2Tickets = items.filter(
    (item) => item.predictedPriority === "P1" || item.predictedPriority === "P2"
  ).length;
  const slaBreachRisk = items.filter(
    (item) => item.slaRiskLevel === "high" || item.slaRiskLevel === "critical"
  ).length;
  const averagePriorityScore = Math.round(
    items.reduce((total, item) => total + item.priorityScore, 0) / items.length
  );

  return {
    summary: {
      openTickets: openItems.length,
      p1P2Tickets,
      slaBreachRisk,
      averagePriorityScore,
      dominantPriority: items[0]?.predictedPriority ?? "P4",
      criticalImpactTickets: items.filter(
        (item) => item.businessImpact === "critical"
      ).length,
      securityRelatedTickets: items.filter((item) => item.isSecurityRelated).length,
      p1P2RiskLevel:
        p1P2Tickets >= 4 ? "critical" : p1P2Tickets >= 2 ? "high" : "medium",
      slaBreachRiskLevel: slaBreachRisk >= 3 ? "high" : "medium",
      averagePriorityRiskLevel:
        averagePriorityScore >= 70 ? "high" : "medium",
    },
    items,
    priorityDistribution: buildPriorityDistribution(items),
    categoryDistribution: buildCategoryDistribution(items),
  };
}

function classifyTicket(ticket: SupportTicketRecord): TicketClassification {
  const priorityScore = calculateTicketPriorityScore(ticket);
  const predictedPriority =
    priorityScore >= 90
      ? "P1"
      : priorityScore >= 72
        ? "P2"
        : priorityScore >= 48
          ? "P3"
          : "P4";
  const slaRiskLevel = riskScoreToLevel(
    Math.min(
      99,
      priorityScore + (hoursUntil(ticket.slaDueAt) < 4 ? 14 : hoursUntil(ticket.slaDueAt) < 12 ? 8 : 0)
    )
  );

  return {
    ...ticket,
    priorityScore,
    predictedPriority,
    classificationReason: buildClassificationReason(ticket, priorityScore),
    recommendedAction: buildRecommendedAction(ticket, predictedPriority),
    slaRiskLevel,
  };
}

function buildClassificationReason(
  ticket: SupportTicketRecord,
  score: number
): string {
  const reasons: string[] = [];
  reasons.push(`Impact=${ticket.businessImpact}`);
  reasons.push(`Urgency=${ticket.urgency}`);
  if (ticket.hasCustomerImpact) reasons.push("customer-facing");
  if (ticket.isSecurityRelated) reasons.push("security-related");
  if (ticket.isVipRequester) reasons.push("VIP requester");
  if (ticket.affectedUsersCount >= 100) reasons.push(`users=${ticket.affectedUsersCount}`);
  reasons.push(`score=${score}`);
  return reasons.join(" | ");
}

function buildRecommendedAction(
  ticket: SupportTicketRecord,
  priority: TicketClassification["predictedPriority"]
): string {
  if (priority === "P1") {
    return `Escalate immediately to ${ticket.affectedService} incident owner.`;
  }
  if (priority === "P2") {
    return `Route to ${ticket.category} operations queue with same-shift follow-up.`;
  }
  if (ticket.isSecurityRelated) {
    return "Validate security relevance and notify the SOC triage channel.";
  }
  return "Handle in standard queue and monitor SLA window.";
}

function hoursUntil(value: string): number {
  return (Date.parse(value) - Date.now()) / (1000 * 60 * 60);
}

function buildPriorityDistribution(items: TicketClassification[]) {
  const colors = {
    P1: "var(--nexus-red)",
    P2: "var(--nexus-warning)",
    P3: "var(--nexus-blue)",
    P4: "var(--nexus-green)",
  } as const;

  return (["P1", "P2", "P3", "P4"] as const).map((priority) => ({
    label: priority,
    value: items.filter((item) => item.predictedPriority === priority).length,
    color: colors[priority],
  }));
}

function buildCategoryDistribution(items: TicketClassification[]) {
  const colors = [
    "var(--nexus-purple)",
    "var(--nexus-blue)",
    "var(--nexus-warning)",
    "var(--nexus-green)",
    "var(--nexus-red)",
  ];
  const counts = new Map<string, number>();

  for (const item of items) {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1])
    .map(([label, value], index) => ({
      label,
      value,
      color: colors[index % colors.length],
    }));
}
