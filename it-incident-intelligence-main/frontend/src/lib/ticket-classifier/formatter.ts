import type { TicketPriority } from "@/types/incident";

type Priority = TicketPriority["recommended_priority"];

export type TicketClassifierRow = TicketPriority & {
  priorityBadgeClass: string;
  isOpen: boolean;
};

export type TicketClassifierHeatCell = {
  service: string;
  score: number;
  displayValue: string;
  backgroundColor: string;
  textColor: string;
};

export type TicketClassifierHeatmapRow = {
  category: string;
  cells: TicketClassifierHeatCell[];
};

export type TicketClassifierLegendItem = {
  label: string;
  color: string;
};

export type TicketClassifierViewModel = {
  ticketCount: number;
  rows: TicketClassifierRow[];
  services: string[];
  heatmapRows: TicketClassifierHeatmapRow[];
  legendItems: TicketClassifierLegendItem[];
};

const PRIORITY_BADGE_CLASSES: Record<Priority, string> = {
  P1: "priority-p1",
  P2: "priority-p2",
  P3: "priority-p3",
  P4: "priority-p4",
};

const LEGEND_ITEMS: TicketClassifierLegendItem[] = [
  { label: ">=80", color: "var(--rose-dim)" },
  { label: "65-79", color: "var(--amber-dim)" },
  { label: "45-64", color: "var(--sky-dim)" },
  { label: "<45", color: "var(--emerald-dim)" },
];

export function formatTicketClassifierViewModel(
  tickets: TicketPriority[]
): TicketClassifierViewModel {
  const services = Array.from(new Set(tickets.map((ticket) => ticket.service))).sort();
  const categories = Array.from(new Set(tickets.map((ticket) => ticket.category))).sort();
  const scoresByCategoryAndService = buildHeatmapScores(tickets);

  return {
    ticketCount: tickets.length,
    rows: tickets.map((ticket) => ({
      ...ticket,
      priorityBadgeClass: PRIORITY_BADGE_CLASSES[ticket.recommended_priority],
      isOpen: ticket.status.toLowerCase() === "open",
    })),
    services,
    heatmapRows: categories.map((category) => ({
      category,
      cells: services.map((service) => {
        const score = scoresByCategoryAndService[category]?.[service] ?? 0;

        return {
          service,
          score,
          displayValue: score > 0 ? String(score) : "-",
          backgroundColor: heatBackgroundColor(score),
          textColor: heatTextColor(score),
        };
      }),
    })),
    legendItems: LEGEND_ITEMS,
  };
}

function buildHeatmapScores(
  tickets: TicketPriority[]
): Record<string, Record<string, number>> {
  const heatmap: Record<string, Record<string, number>> = {};

  for (const ticket of tickets) {
    if (!heatmap[ticket.category]) {
      heatmap[ticket.category] = {};
    }

    const previous = heatmap[ticket.category][ticket.service] ?? 0;
    if (ticket.score > previous) {
      heatmap[ticket.category][ticket.service] = ticket.score;
    }
  }

  return heatmap;
}

function heatBackgroundColor(score: number): string {
  if (score >= 80) return "var(--rose-dim)";
  if (score >= 65) return "var(--amber-dim)";
  if (score >= 45) return "var(--sky-dim)";
  if (score > 0) return "var(--emerald-dim)";
  return "var(--bg-elevated)";
}

function heatTextColor(score: number): string {
  if (score >= 80) return "var(--rose)";
  if (score >= 65) return "var(--amber)";
  if (score >= 45) return "var(--sky)";
  if (score > 0) return "var(--emerald)";
  return "var(--text-muted)";
}
