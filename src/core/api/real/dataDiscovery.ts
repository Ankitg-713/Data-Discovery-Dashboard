import type { ApiResult, DataDiscoveryResponse } from "../types";

const NOT_IMPLEMENTED = { code: "NOT_IMPLEMENTED", message: "Backend not configured" } as const;

export async function getDataDiscovery(): Promise<ApiResult<DataDiscoveryResponse>> {
  // TODO: const res = await fetch(`${BASE_URL}/data-discovery`);
  return { error: NOT_IMPLEMENTED };
}
