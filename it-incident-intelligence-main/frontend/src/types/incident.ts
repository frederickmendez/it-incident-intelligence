/* ── Core API types (match backend schemas) ─────────────────── */

export type RecurringProblem = {
  signature: string;
  category: string;
  service: string;
  keyword_bucket: string;
  frequency: number;
  last_seen: string;
  trend_delta: number;
  sample_ticket_ids: string[];
  sample_titles: string[];
};

export type TicketPriority = {
  ticket_id: string;
  title: string;
  category: string;
  service: string;
  status: string;
  score: number;
  recommended_priority: "P1" | "P2" | "P3" | "P4";
  reasons: string[];
};

export type PriorityBatchResponse = {
  items: TicketPriority[];
};

export type TrendPoint = {
  date: string;
  count: number;
};

export type IncidentSummary = {
  open_tickets: number;
  recurring_clusters: number;
  high_risk_tickets: number;
  top_services: string[];
  trends: TrendPoint[];
};

/* ── Dashboard aggregate ────────────────────────────────────── */

export type CloudResource = {
  id: string;
  provider: "AWS" | "Azure";
  service: string;
  type: string;
  status: "running" | "stopped" | "idle" | "unattached";
  cpu_usage_percent: number | null;
  monthly_cost: number;
  reason: string;
};

export type CloudSummary = {
  total_waste_estimated: number;
  idle_resources_count: number;
  unattached_resources_count: number;
  top_wasted_services: BarItem[];
};

export type DashboardData = {
  summary: IncidentSummary;
  recurring: RecurringProblem[];
  priorities: TicketPriority[];
  cloudCosts?: {
    summary: CloudSummary;
    resources: CloudResource[];
  };
  source: "api" | "mock";
};

/* ── Chart helper types ─────────────────────────────────────── */

export type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

export type BarItem = {
  label: string;
  value: number;
  color?: string;
};
