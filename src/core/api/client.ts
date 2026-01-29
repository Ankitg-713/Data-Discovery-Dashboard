import { DEMO_MODE } from "@/core/config";
import * as mock from "./mock";
import * as real from "./real";
import type {
  ApiResult,
  DashboardSummary,
  ObservabilityMetrics,
  DataDiscoveryResponse,
  DataAccessResponse,
  BackfillResponse,
} from "./types";

export interface ApiClient {
  dashboard: { getSummary: () => Promise<ApiResult<DashboardSummary>> };
  observability: { getMetrics: () => Promise<ApiResult<ObservabilityMetrics>> };
  dataDiscovery: { getData: () => Promise<ApiResult<DataDiscoveryResponse>> };
  dataAccess: { getData: () => Promise<ApiResult<DataAccessResponse>> };
  backfill: { getData: () => Promise<ApiResult<BackfillResponse>> };
}

export function createApiClient(demoMode: boolean): ApiClient {
  const impl = demoMode ? mock : real;
  return {
    dashboard: { getSummary: impl.getDashboardSummary },
    observability: { getMetrics: impl.getObservabilityMetrics },
    dataDiscovery: { getData: impl.getDataDiscovery },
    dataAccess: { getData: impl.getDataAccess },
    backfill: { getData: impl.getBackfill },
  };
}

export const api = createApiClient(DEMO_MODE);
