import type { SupportTicket } from "./types";

export type UrgentTicketClassifierSummary = {
  summary: {
    total_tickets: number;
    p1_tickets: number;
  };
  calculation_notes: string[];
};

export function summarizeUrgentTicketClassifier(
  tickets: SupportTicket[]
): UrgentTicketClassifierSummary {
  const p1Tickets = tickets.filter((ticket) => ticket.current_priority === "P1");

  return {
    summary: {
      total_tickets: tickets.length,
      p1_tickets: p1Tickets.length,
    },
    calculation_notes: [
      `Urgent Ticket Classifier counts tickets currently classified as P1 across ${tickets.length} mock support tickets.`,
      `${p1Tickets.length} tickets are currently classified as P1.`,
    ],
  };
}
