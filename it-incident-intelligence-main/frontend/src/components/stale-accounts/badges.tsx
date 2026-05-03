import type {
  StaleAccountAction,
  StaleAccountResult,
  StaleAccountStatus,
} from "@/lib/stale-account-cleanup/types";

const statusBadgeClasses: Record<StaleAccountStatus, string> = {
  active: "priority-p4",
  review_required: "priority-p2",
  eligible_for_suspension: "priority-p1",
  protected_review: "priority-p3",
};

const riskLabels: Record<StaleAccountStatus, string> = {
  active: "Low",
  review_required: "Review",
  eligible_for_suspension: "High",
  protected_review: "Protected",
};

function formatLabel(value: string): string {
  return value.replaceAll("_", " ");
}

export function StatusBadge({ status }: { status: StaleAccountStatus }) {
  return (
    <span className={`priority-badge ${statusBadgeClasses[status]}`}>
      {formatLabel(status)}
    </span>
  );
}

export function RiskBadge({ item }: { item: StaleAccountResult }) {
  return (
    <span className={`priority-badge ${statusBadgeClasses[item.status]}`}>
      {riskLabels[item.status]} risk
    </span>
  );
}

export function ActionBadge({ action }: { action: StaleAccountAction }) {
  return (
    <span className="category-chip">
      {formatLabel(action)}
    </span>
  );
}
