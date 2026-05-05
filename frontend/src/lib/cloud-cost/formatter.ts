import type { BarItem, CloudResource, CloudSummary } from "@/types/incident";
import type { DonutSegment } from "@/types/incident";

type CloudCostData = {
  summary: CloudSummary;
  resources: CloudResource[];
};

export type CloudCostResourceRow = CloudResource & {
  statusBadgeClass: string;
};

export type CloudCostOptimizationTip = {
  color: string;
  label: string;
  description: string;
};

export type CloudCostViewModel = {
  summary: CloudSummary;
  resources: CloudCostResourceRow[];
  statusSegments: DonutSegment[];
  topWastedServices: BarItem[];
  optimizationTips: CloudCostOptimizationTip[];
};

const STATUS_BADGE_CLASSES: Record<CloudResource["status"], string> = {
  running: "priority-p4",
  stopped: "priority-p3",
  unattached: "priority-p2",
  idle: "priority-p1",
};

const STATUS_COLORS: Record<CloudResource["status"], string> = {
  running: "var(--emerald)",
  stopped: "var(--sky)",
  unattached: "var(--amber)",
  idle: "var(--rose)",
};

const OPTIMIZATION_TIPS: CloudCostOptimizationTip[] = [
  {
    color: "var(--rose)",
    label: "Idle Instances",
    description: "VMs with <2% CPU for 14+ days. Downsize or terminate them.",
  },
  {
    color: "var(--amber)",
    label: "Unattached Disks",
    description:
      "Orphaned EBS/Managed Disks left behind after VM deletion. Delete immediately.",
  },
  {
    color: "var(--sky)",
    label: "Stopped Resources",
    description: "Stopped VMs still incur storage costs for their OS disks.",
  },
];

export function formatCloudCostViewModel(
  costs: CloudCostData
): CloudCostViewModel {
  const statusSegments = buildStatusSegments(costs.resources);

  return {
    summary: costs.summary,
    resources: costs.resources.map((resource) => ({
      ...resource,
      statusBadgeClass: STATUS_BADGE_CLASSES[resource.status],
    })),
    statusSegments,
    topWastedServices: costs.summary.top_wasted_services,
    optimizationTips: OPTIMIZATION_TIPS,
  };
}

function buildStatusSegments(resources: CloudResource[]): DonutSegment[] {
  const counts: Partial<Record<CloudResource["status"], number>> = {};

  for (const resource of resources) {
    counts[resource.status] = (counts[resource.status] ?? 0) + 1;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({
      label,
      value,
      color: STATUS_COLORS[label as CloudResource["status"]],
    }));
}
