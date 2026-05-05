import type { SupportTicketRecord } from "./types";

const IMPACT_POINTS: Record<SupportTicketRecord["businessImpact"], number> = {
  critical: 35,
  high: 26,
  medium: 16,
  low: 8,
};

const URGENCY_POINTS: Record<SupportTicketRecord["urgency"], number> = {
  critical: 28,
  high: 20,
  medium: 12,
  low: 4,
};

export function calculateTicketPriorityScore(ticket: SupportTicketRecord): number {
  let score = 0;

  score += IMPACT_POINTS[ticket.businessImpact];
  score += URGENCY_POINTS[ticket.urgency];

  if (ticket.hasCustomerImpact) score += 12;
  if (ticket.isSecurityRelated) score += 10;
  if (ticket.isVipRequester) score += 8;
  if (ticket.affectedUsersCount >= 1000) score += 12;
  else if (ticket.affectedUsersCount >= 100) score += 7;
  else if (ticket.affectedUsersCount >= 20) score += 4;

  const keywords = ticket.keywords.map((keyword) => keyword.toLowerCase());
  if (keywords.some((keyword) => ["payment", "outage", "mfa", "login", "sso"].includes(keyword))) {
    score += 8;
  }

  if (hoursUntil(ticket.slaDueAt) < 2) score += 12;
  else if (hoursUntil(ticket.slaDueAt) < 6) score += 8;
  else if (hoursUntil(ticket.slaDueAt) < 12) score += 4;

  return Math.min(99, Math.round(score));
}

function hoursUntil(value: string): number {
  return (Date.parse(value) - Date.now()) / (1000 * 60 * 60);
}
