import type { RiskLevel } from "@/lib/shared/riskLevels";

export type TicketSourceSystem =
  | "ServiceNow"
  | "Jira Service Management"
  | "Zendesk";

export type TicketStatus =
  | "new"
  | "open"
  | "in_progress"
  | "pending"
  | "resolved";

export type TicketImpact = "critical" | "high" | "medium" | "low";
export type TicketUrgency = "critical" | "high" | "medium" | "low";
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

export type SupportTicketRecord = {
  ticketId: string;
  title: string;
  description: string;
  requester: string;
  requesterDepartment: string;
  requesterRole: string;
  affectedService: string;
  category: string;
  channel: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  slaDueAt: string;
  businessImpact: "critical" | "high" | "medium" | "low";
  urgency: "critical" | "high" | "medium" | "low";
  affectedUsersCount: number;
  isVipRequester: boolean;
  isSecurityRelated: boolean;
  hasCustomerImpact: boolean;
  keywords: string[];
  priorityScore: number;
  predictedPriority: "pending" | "P1" | "P2" | "P3" | "P4";
  classificationReason: string;
  recommendedAction: string;
};

export type TicketClassification = Omit<
  SupportTicketRecord,
  "priorityScore" | "predictedPriority" | "classificationReason" | "recommendedAction"
> & {
  priorityScore: number;
  predictedPriority: "P1" | "P2" | "P3" | "P4";
  classificationReason: string;
  recommendedAction: string;
  slaRiskLevel: RiskLevel;
};

export type TicketClassifierAnalysis = {
  summary: {
    openTickets: number;
    p1P2Tickets: number;
    slaBreachRisk: number;
    averagePriorityScore: number;
    dominantPriority: "P1" | "P2" | "P3" | "P4";
    criticalImpactTickets: number;
    securityRelatedTickets: number;
    p1P2RiskLevel: RiskLevel;
    slaBreachRiskLevel: RiskLevel;
    averagePriorityRiskLevel: RiskLevel;
  };
  items: TicketClassification[];
  priorityDistribution: {
    label: "P1" | "P2" | "P3" | "P4";
    value: number;
    color: string;
  }[];
  categoryDistribution: {
    label: string;
    value: number;
    color: string;
  }[];
};
