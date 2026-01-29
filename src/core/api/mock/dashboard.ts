import type { ApiResult, DashboardSummary, DataSourceSummary } from "../types";
import { simulateDelay } from "./delay";
import {
  orgDataSources,
  orgAlerts,
  totalSensitiveRecords,
  totalDataSourcesCount,
  totalAlertsCount,
} from "./data/organization";

export async function getDashboardSummary(): Promise<ApiResult<DashboardSummary>> {
  await simulateDelay();

  // Map org sources to Dashboard DataSourceSummary (same list as Data Discovery)
  const dataSources: DataSourceSummary[] = orgDataSources.map((s) => ({
    name: s.name,
    type: s.type,
    status: s.status === "connected" ? "active" : "syncing",
    records: s.totalRecords,
    iconKey: s.iconKey,
  }));

  const recentAlerts = orgAlerts.slice(0, 8).map((a) => ({
    id: a.id,
    title: a.title,
    source: a.source,
    severity: a.severity,
    time: a.time,
    iconKey: a.iconKey,
  }));

  return {
    data: {
      stats: [
        { title: "Total Data Sources", value: totalDataSourcesCount, change: 12, changeType: "increase", iconKey: "database", color: "cyan" },
        { title: "Sensitive Records", value: totalSensitiveRecords, change: 23, changeType: "increase", iconKey: "shield", color: "purple" },
        { title: "Security Alerts", value: totalAlertsCount, change: -8, changeType: "decrease", iconKey: "alertTriangle", color: "amber" },
        { title: "Active Scans", value: 12, change: 5, changeType: "increase", iconKey: "eye", color: "emerald" },
      ],
      accessTrend: [
        { name: "Mon", value: 1200, value2: 900 },
        { name: "Tue", value: 1800, value2: 1200 },
        { name: "Wed", value: 1400, value2: 1100 },
        { name: "Thu", value: 2200, value2: 1600 },
        { name: "Fri", value: 1900, value2: 1400 },
        { name: "Sat", value: 800, value2: 600 },
        { name: "Sun", value: 600, value2: 400 },
      ],
      classification: [
        { name: "PII", value: 45 },
        { name: "PHI", value: 25 },
        { name: "PCI", value: 15 },
        { name: "Credentials", value: 10 },
        { name: "Other", value: 5 },
      ],
      riskDistribution: [
        { name: "Critical", value: 12 },
        { name: "High", value: 28 },
        { name: "Medium", value: 45 },
        { name: "Low", value: 89 },
      ],
      recentAlerts,
      dataSources,
      securityScore: 87,
      securityUsersCount: 234,
      securityUptimePercent: 99.9,
      lastUpdatedAt: Date.now(),
    },
  };
}
