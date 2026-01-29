import type { ApiResult, DashboardSummary } from "../types";

const NOT_IMPLEMENTED = { code: "NOT_IMPLEMENTED", message: "Backend not configured" } as const;

export async function getDashboardSummary(): Promise<ApiResult<DashboardSummary>> {
  // TODO: const res = await fetch(`${BASE_URL}/dashboard/summary`);
  // TODO: if (!res.ok) return { error: { code: String(res.status), message: await res.text() } };
  // TODO: const json = await res.json(); return { data: mapBackendToDashboardSummary(json) };
  return { error: NOT_IMPLEMENTED };
}
