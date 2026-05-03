export type TicketSourceSystem = "ServiceNow" | "Jira Service Management" | "Zendesk";

export type TicketImpact = "critical" | "high" | "medium" | "low";

export type TicketUrgency = "critical" | "high" | "medium" | "low";

export type TicketStatus = "new" | "open" | "in_progress" | "pending" | "resolved";

export type ServiceTier = "tier_0" | "tier_1" | "tier_2" | "tier_3";

export type SupportTicket = {
  id: string;
  source_system: TicketSourceSystem;
  created_at: string;
  updated_at: string;
  status: TicketStatus;
  title: string;
  description: string;
  category: string;
  affected_service: string;
  service_tier: ServiceTier;
  requester_department: string;
  requester_region: string;
  affected_users_count: number;
  impact: TicketImpact;
  urgency: TicketUrgency;
  current_priority: "P1" | "P2" | "P3" | "P4";
  sla_due_at: string;
  support_queue: string;
  keywords: string[];
  related_ticket_ids: string[];
};
