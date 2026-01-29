import type { ApiResult, ObservabilityMetrics } from "../types";
import { simulateDelay } from "./delay";
import { orgLiveEvents, orgEnforcements, getPiiDensitySources } from "./data/organization";

export async function getObservabilityMetrics(): Promise<ApiResult<ObservabilityMetrics>> {
  await simulateDelay();

  const criticalCount = orgLiveEvents.filter((e) => e.severity === "critical").length;

  return {
    data: {
      criticalDetectionsCount: criticalCount,
      criticalDetectionsWindowMinutes: 5,
      piiDensitySources: getPiiDensitySources(),
      liveDiscoveryEvents: orgLiveEvents,
      enforcementActions: orgEnforcements,
    },
  };
}
