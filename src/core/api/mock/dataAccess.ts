import type { ApiResult, DataAccessResponse } from "../types";
import { simulateDelay } from "./delay";
import { orgAccessLogs } from "./data/organization";

export async function getDataAccess(): Promise<ApiResult<DataAccessResponse>> {
  await simulateDelay();

  const detokenizeCount = orgAccessLogs.filter((log) => log.operation === "detokenize").length;
  const deniedCount = orgAccessLogs.filter((log) => log.status === "denied").length;
  const formatMetric = (n: number) => (n >= 1000 ? n.toLocaleString() : String(n));

  return {
    data: {
      metrics: [
        { label: "Detokenization Requests (1h)", value: formatMetric(detokenizeCount), iconKey: "unlock", colorKey: "primary" },
        { label: "Denied Requests", value: formatMetric(deniedCount), iconKey: "ban", colorKey: "danger" },
        { label: "Avg Latency", value: "1.2s", iconKey: "timer", colorKey: "success" },
      ],
      logs: orgAccessLogs,
      anomaly: {
        ip: "10.0.4.15",
        service: "Support_App",
        rate: ">5k/min",
      },
    },
  };
}
