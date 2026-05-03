export const ROOT_DASHBOARD_VIEWS = [
  "overview",
  "urgent-ticket-classifier",
  "cloud-cost-auditor",
  "reports",
] as const;

export type RootDashboardView = (typeof ROOT_DASHBOARD_VIEWS)[number];

const LEGACY_VIEW_ALIASES: Record<string, RootDashboardView> = {
  overview: "overview",
  priorities: "urgent-ticket-classifier",
  "urgent-ticket-classifier": "urgent-ticket-classifier",
  "cloud-costs": "cloud-cost-auditor",
  "cloud-cost-auditor": "cloud-cost-auditor",
  incidents: "reports",
  reports: "reports",
};

export function normalizeRootDashboardView(
  view: string | string[] | undefined
): RootDashboardView {
  const rawValue = Array.isArray(view) ? view[0] : view;

  if (!rawValue) {
    return "overview";
  }

  return LEGACY_VIEW_ALIASES[rawValue] ?? "overview";
}

export function buildRootDashboardHref(view: RootDashboardView): string {
  return view === "overview" ? "/" : `/?view=${view}`;
}
