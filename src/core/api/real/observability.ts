import type { ApiResult, ObservabilityMetrics } from "../types";

const NOT_IMPLEMENTED = { code: "NOT_IMPLEMENTED", message: "Backend not configured" } as const;

export async function getObservabilityMetrics(): Promise<ApiResult<ObservabilityMetrics>> {
  // TODO: const res = await fetch(`${BASE_URL}/observability/metrics`);
  return { error: NOT_IMPLEMENTED };
}
