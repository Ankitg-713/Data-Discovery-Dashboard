import type { ApiResult, DataAccessResponse } from "../types";

const NOT_IMPLEMENTED = { code: "NOT_IMPLEMENTED", message: "Backend not configured" } as const;

export async function getDataAccess(): Promise<ApiResult<DataAccessResponse>> {
  // TODO: const res = await fetch(`${BASE_URL}/data-access`);
  return { error: NOT_IMPLEMENTED };
}
