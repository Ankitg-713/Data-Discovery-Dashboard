import type { ApiResult, DataDiscoveryResponse, DataDiscoverySource } from "../types";
import { simulateDelay } from "./delay";
import { orgDataSources, getOrgAssets } from "./data/organization";

export async function getDataDiscovery(): Promise<ApiResult<DataDiscoveryResponse>> {
  await simulateDelay();

  // Same sources as Dashboard (exact same list)
  const sources: DataDiscoverySource[] = orgDataSources.map((s) => ({
    id: s.id,
    name: s.name,
    type: s.type,
    status: (s.status === "syncing" ? "syncing" : "connected") as DataDiscoverySource["status"],
    lastSync: s.lastSync,
    totalRecords: s.totalRecords,
    sensitiveRecords: s.sensitiveRecords,
    iconKey: s.iconKey,
  }));

  const assets = getOrgAssets();

  return {
    data: {
      sources,
      assets,
    },
  };
}
