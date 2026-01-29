import type { ApiResult, BackfillResponse } from "../types";

const NOT_IMPLEMENTED = { code: "NOT_IMPLEMENTED", message: "Backend not configured" } as const;

export async function getBackfill(): Promise<ApiResult<BackfillResponse>> {
  // TODO: const res = await fetch(`${BASE_URL}/backfill`);
  return { error: NOT_IMPLEMENTED };
}
