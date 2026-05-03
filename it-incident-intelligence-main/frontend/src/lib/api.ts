import { mockDashboardData } from "@/lib/mockData";
import {
  DashboardData,
  IncidentSummary,
  PriorityBatchResponse,
  RecurringProblem,
} from "@/types/incident";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://127.0.0.1:8000";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }
  return (await response.json()) as T;
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const [summary, recurring, priorities] = await Promise.all([
      getJson<IncidentSummary>("/api/v1/incidents/summary"),
      getJson<RecurringProblem[]>("/api/v1/incidents/recurring?window_days=30&limit=20"),
      fetch(`${API_BASE_URL}/api/v1/incidents/priority/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        cache: "no-store",
        body: JSON.stringify({ limit: 25 }),
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error("priority batch failed");
        }
        return (await response.json()) as PriorityBatchResponse;
      }),
    ]);

    return {
      source: "api",
      summary,
      recurring,
      priorities: priorities.items,
    };
  } catch {
    return mockDashboardData;
  }
}
