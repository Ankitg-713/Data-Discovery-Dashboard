/**
 * API contracts (request/response types).
 * UI and backend both target these shapes; real backend can map its response to these.
 */

export interface ApiError {
  code: string;
  message: string;
}

export type ApiResult<T> = { data: T } | { error: ApiError };

// ----- Dashboard -----
export type StatChangeType = "increase" | "decrease";
export type StatIconKey = "database" | "shield" | "alertTriangle" | "eye";
export type StatColorKey = "cyan" | "purple" | "amber" | "emerald";

export interface DashboardStatCard {
  title: string;
  value: number;
  change: number;
  changeType: StatChangeType;
  iconKey: StatIconKey;
  color: StatColorKey;
}

export interface AccessTrendPoint {
  name: string;
  value: number;
  value2: number;
}

export interface ClassificationPoint {
  name: string;
  value: number;
}

export interface RiskDistributionPoint {
  name: string;
  value: number;
}

export interface RecentAlert {
  id: number;
  title: string;
  source: string;
  severity: "critical" | "high" | "medium" | "info";
  time: string;
  iconKey: "fileWarning" | "alertTriangle" | "shield" | "database";
}

export interface DataSourceSummary {
  name: string;
  type: string;
  status: "active" | "syncing";
  records: number;
  iconKey: "cloud" | "server" | "database";
}

export interface DashboardSummary {
  stats: DashboardStatCard[];
  accessTrend: AccessTrendPoint[];
  classification: ClassificationPoint[];
  riskDistribution: RiskDistributionPoint[];
  recentAlerts: RecentAlert[];
  dataSources: DataSourceSummary[];
  securityScore: number;
  securityUsersCount: number;
  securityUptimePercent: number;
  /** Unix ms when data was fetched (for "Last updated" in demo) */
  lastUpdatedAt?: number;
}

// ----- Observability -----
export type PiiRiskLevel = "critical" | "high" | "medium" | "low";

export interface PiiDensitySource {
  name: string;
  risk: PiiRiskLevel;
  iconKey: "database" | "server" | "cloud";
  /** Connection status so Observability matches org data sources (connected/syncing/active). */
  status?: "connected" | "syncing" | "active";
}

export interface LiveDiscoveryEvent {
  time: string;
  message: string;
  severity: "critical" | "high" | "medium";
}

export interface EnforcementAction {
  resource: string;
  column: string;
  type: string;
  confidence: string;
  action: string;
}

export interface ObservabilityMetrics {
  criticalDetectionsCount: number;
  criticalDetectionsWindowMinutes: number;
  piiDensitySources: PiiDensitySource[];
  liveDiscoveryEvents: LiveDiscoveryEvent[];
  enforcementActions: EnforcementAction[];
}

// ----- Data Discovery -----
export type DataAssetType = "pii" | "phi" | "pci" | "credentials" | "financial" | "general";
export type DataAssetSourceType = "database" | "cloud" | "file";
export type DataAssetRiskLevel = "critical" | "high" | "medium" | "low";
export type DataAssetStatus = "active" | "resolved" | "investigating";
export type DataSourceStatus = "connected" | "syncing" | "error" | "pending";

export interface DataDiscoverySource {
  id: string;
  name: string;
  type: string;
  status: DataSourceStatus;
  lastSync: string;
  totalRecords: number;
  sensitiveRecords: number;
  iconKey: "database" | "cloud" | "server";
}

export interface DataAsset {
  id: string;
  name: string;
  type: DataAssetType;
  source: string;
  sourceType: DataAssetSourceType;
  location: string;
  riskLevel: DataAssetRiskLevel;
  recordCount: number;
  lastScanned: string;
  status: DataAssetStatus;
  classification: string[];
}

export interface DataDiscoveryResponse {
  sources: DataDiscoverySource[];
  assets: DataAsset[];
}

// ----- Data Access -----
export type AccessOperation = "read" | "detokenize";
export type AccessStatus = "allowed" | "denied";

export interface DataAccessMetric {
  label: string;
  value: string;
  iconKey: "unlock" | "ban" | "timer";
  colorKey: "primary" | "danger" | "success";
}

export interface DataAccessLogEntry {
  time: string;
  actor: string;
  resource: string;
  purpose: string;
  operation: AccessOperation;
  status: AccessStatus;
}

export interface DataAccessAnomaly {
  ip: string;
  service: string;
  rate: string;
}

export interface DataAccessResponse {
  metrics: DataAccessMetric[];
  logs: DataAccessLogEntry[];
  anomaly: DataAccessAnomaly | null;
}

// ----- Backfill -----
export interface BackfillOrchestratorStat {
  label: string;
  value: string | number;
  iconKey: "activity" | "database" | "cpu";
}

export interface BackfillJobDetail {
  table: string;
  engine: string;
  progress: number;
  processed: string;
  total: string;
  batch: string;
  commit: string;
  latency: string;
  impact: string;
}

export interface BackfillResponse {
  orchestratorStats: BackfillOrchestratorStat[];
  activeJob: BackfillJobDetail | null;
}
