import type { ApiResult, BackfillResponse } from "../types";
import { simulateDelay } from "./delay";
import { orgDataSources } from "./data/organization";

export async function getBackfill(): Promise<ApiResult<BackfillResponse>> {
  await simulateDelay();

  // Job references organization (Oracle - Finance ERP)
  void orgDataSources.find((s) => s.type.includes("Oracle"));

  return {
    data: {
      orchestratorStats: [
        { label: "Active Jobs", value: 3, iconKey: "activity" },
        { label: "Throughput", value: "45k rows/sec", iconKey: "database" },
        { label: "CPU Cap", value: "2%", iconKey: "cpu" },
      ],
      activeJob: {
        table: "CUSTOMER_MASTER",
        engine: "Oracle 19c",
        progress: 82,
        processed: "42.1M",
        total: "51.2M",
        batch: "Chunk ID 4001",
        commit: "Every 2k rows",
        latency: "12ms / batch",
        impact: "8.4%",
      },
    },
  };
}
