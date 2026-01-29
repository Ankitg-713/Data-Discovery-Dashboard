/**
 * Single source of truth for demo/mock data.
 * All pages (Dashboard, Data Discovery, Observability, Data Access, Backfill) use this
 * so the app feels like one connected organization.
 */

import type { DataAsset, DataAssetType, DataAssetSourceType, DataAssetRiskLevel, DataAssetStatus } from "../../types";

export type SourceStatus = "active" | "syncing" | "connected" | "syncing";
export type SourceIconKey = "cloud" | "server" | "database";

export interface OrgDataSource {
  id: string;
  name: string;
  type: string;
  status: "active" | "syncing" | "connected";
  lastSync: string;
  totalRecords: number;
  sensitiveRecords: number;
  iconKey: SourceIconKey;
}

export interface OrgAlert {
  id: number;
  title: string;
  source: string; // must match an OrgDataSource.name or related system
  severity: "critical" | "high" | "medium" | "info";
  time: string;
  iconKey: "fileWarning" | "alertTriangle" | "shield" | "database";
}

export interface OrgLiveEvent {
  time: string;
  message: string;
  severity: "critical" | "high" | "medium";
}

export interface OrgEnforcement {
  resource: string;
  column: string;
  type: string;
  confidence: string;
  action: string;
}

export interface OrgAccessLog {
  time: string;
  actor: string;
  resource: string;
  purpose: string;
  operation: "read" | "detokenize";
  status: "allowed" | "denied";
}

// ----- Organization-scale data sources (same list for Dashboard + Data Discovery) -----
export const orgDataSources: OrgDataSource[] = [
  { id: "1", name: "PostgreSQL - CRM Production", type: "Relational Database", status: "connected", lastSync: "2 min ago", totalRecords: 2400000, sensitiveRecords: 157500, iconKey: "database" },
  { id: "2", name: "AWS S3 - Finance Bucket", type: "Cloud Storage", status: "syncing", lastSync: "Syncing...", totalRecords: 890000, sensitiveRecords: 89342, iconKey: "cloud" },
  { id: "3", name: "MongoDB - HR Database", type: "NoSQL Database", status: "connected", lastSync: "5 min ago", totalRecords: 1200000, sensitiveRecords: 12500, iconKey: "database" },
  { id: "4", name: "Snowflake - Analytics Warehouse", type: "Data Warehouse", status: "connected", lastSync: "15 min ago", totalRecords: 2100000, sensitiveRecords: 234000, iconKey: "server" },
  { id: "5", name: "Google Cloud Storage - Backups", type: "Cloud Storage", status: "connected", lastSync: "8 min ago", totalRecords: 456000, sensitiveRecords: 342, iconKey: "cloud" },
  { id: "6", name: "Oracle - Finance ERP", type: "Relational Database", status: "connected", lastSync: "1 min ago", totalRecords: 5120000, sensitiveRecords: 890000, iconKey: "database" },
  { id: "7", name: "Azure Blob - Legal Documents", type: "Cloud Storage", status: "active", lastSync: "12 min ago", totalRecords: 320000, sensitiveRecords: 45000, iconKey: "cloud" },
  { id: "8", name: "MySQL - Orders Service", type: "Relational Database", status: "connected", lastSync: "3 min ago", totalRecords: 1560000, sensitiveRecords: 120000, iconKey: "database" },
  { id: "9", name: "Redis - Session Cache", type: "Cache", status: "syncing", lastSync: "Syncing...", totalRecords: 890000, sensitiveRecords: 0, iconKey: "server" },
  { id: "10", name: "Google BigQuery - Marketing", type: "Data Warehouse", status: "connected", lastSync: "20 min ago", totalRecords: 534000, sensitiveRecords: 67000, iconKey: "database" },
  { id: "11", name: "AWS S3 - Customer Data Lake", type: "Cloud Storage", status: "active", lastSync: "4 min ago", totalRecords: 1240000, sensitiveRecords: 310000, iconKey: "cloud" },
  { id: "12", name: "PostgreSQL - Payments", type: "Relational Database", status: "connected", lastSync: "1 min ago", totalRecords: 890000, sensitiveRecords: 200000, iconKey: "database" },
  { id: "13", name: "Kafka - Events Stream", type: "Event Streaming", status: "active", lastSync: "Just now", totalRecords: 0, sensitiveRecords: 0, iconKey: "server" },
  { id: "14", name: "Snowflake - Healthcare Claims", type: "Data Warehouse", status: "connected", lastSync: "25 min ago", totalRecords: 670000, sensitiveRecords: 180000, iconKey: "server" },
  { id: "15", name: "SharePoint - Finance Reports", type: "File Storage", status: "connected", lastSync: "1 hour ago", totalRecords: 15600, sensitiveRecords: 1200, iconKey: "cloud" },
  { id: "16", name: "Elasticsearch - Logs", type: "Search Engine", status: "active", lastSync: "2 min ago", totalRecords: 5000000, sensitiveRecords: 0, iconKey: "server" },
  { id: "17", name: "AWS RDS - Identity Service", type: "Relational Database", status: "connected", lastSync: "30 sec ago", totalRecords: 450000, sensitiveRecords: 450000, iconKey: "database" },
  { id: "18", name: "Azure SQL - Supply Chain", type: "Relational Database", status: "connected", lastSync: "6 min ago", totalRecords: 780000, sensitiveRecords: 45000, iconKey: "database" },
  { id: "19", name: "MongoDB - Product Catalog", type: "NoSQL Database", status: "syncing", lastSync: "Syncing...", totalRecords: 234000, sensitiveRecords: 0, iconKey: "database" },
  { id: "20", name: "S3 - Compliance Snapshots", type: "Cloud Storage", status: "active", lastSync: "45 min ago", totalRecords: 120000, sensitiveRecords: 120000, iconKey: "cloud" },
];

// ----- Shared alerts (Dashboard Recent Alerts + Observability feel) -----
export const orgAlerts: OrgAlert[] = [
  { id: 1, title: "PII Exposure Detected", source: "AWS S3 - Finance Bucket", severity: "critical", time: "2 min ago", iconKey: "fileWarning" },
  { id: 2, title: "Unusual Access Pattern", source: "PostgreSQL - CRM Production", severity: "high", time: "15 min ago", iconKey: "alertTriangle" },
  { id: 3, title: "New Sensitive Data Found", source: "Google Cloud Storage - Backups", severity: "medium", time: "1 hour ago", iconKey: "shield" },
  { id: 4, title: "Scan Completed", source: "MongoDB - HR Database", severity: "info", time: "2 hours ago", iconKey: "database" },
  { id: 5, title: "High-Risk Column Detected", source: "Oracle - Finance ERP", severity: "critical", time: "5 min ago", iconKey: "fileWarning" },
  { id: 6, title: "Tokenization Backfill Started", source: "PostgreSQL - Payments", severity: "info", time: "30 min ago", iconKey: "database" },
  { id: 7, title: "Aadhaar in Unapproved Location", source: "Snowflake - Healthcare Claims", severity: "critical", time: "8 min ago", iconKey: "fileWarning" },
  { id: 8, title: "Access Denied - Policy Violation", source: "AWS RDS - Identity Service", severity: "high", time: "12 min ago", iconKey: "alertTriangle" },
  { id: 9, title: "Scheduled Scan Completed", source: "Azure Blob - Legal Documents", severity: "info", time: "1 hour ago", iconKey: "database" },
  { id: 10, title: "PCI Scope Expansion", source: "MySQL - Orders Service", severity: "medium", time: "45 min ago", iconKey: "shield" },
];

// ----- Live discovery events (Observability) -----
export const orgLiveEvents: OrgLiveEvent[] = [
  { time: "14:22:01", message: "PAN detected in /api/v1/checkout", severity: "critical" },
  { time: "14:21:55", message: "Aadhaar found in user_logs_S3", severity: "high" },
  { time: "14:21:40", message: "12 instances of Mobile_ID flagged", severity: "medium" },
  { time: "14:21:12", message: "New PII column in Oracle - Finance ERP", severity: "critical" },
  { time: "14:20:58", message: "Scan completed for Snowflake - Healthcare Claims", severity: "medium" },
];

// ----- Enforcement actions (Observability) -----
export const orgEnforcements: OrgEnforcement[] = [
  { resource: "finance_prod.main", column: "card", type: "PCI", confidence: "100%", action: "TOKENISED" },
  { resource: "KYC.main", column: "aadhar", type: "PII", confidence: "90%", action: "TOKENISE 10% BACKFILL" },
  { resource: "crm.customers", column: "phone", type: "PII", confidence: "95%", action: "TOKENISED" },
  { resource: "payments.transactions", column: "card_hash", type: "PCI", confidence: "100%", action: "TOKENISED" },
];

// ----- PII density sources (Observability) - subset of orgDataSources, pass through status -----
export function getPiiDensitySources(): { name: string; risk: "critical" | "high" | "medium" | "low"; iconKey: SourceIconKey; status: "connected" | "syncing" | "active" }[] {
  const subset = [orgDataSources[0], orgDataSources[2], orgDataSources[12], orgDataSources[19]];
  const risks: ("critical" | "high" | "medium" | "low")[] = ["critical", "medium", "low", "critical"];
  return subset.map((s, i) => ({ name: s.name, risk: risks[i], iconKey: s.iconKey, status: s.status }));
}

// ----- Data Access logs (same systems across app) -----
export const orgAccessLogs: OrgAccessLog[] = [
  { time: "14:30:11", actor: "payout-service", resource: "bank_account", purpose: "payment", operation: "detokenize", status: "allowed" },
  { time: "14:28:42", actor: "support-app", resource: "aadhaar", purpose: "user verification", operation: "read", status: "allowed" },
  { time: "14:27:05", actor: "support-app", resource: "pan", purpose: "manual review", operation: "detokenize", status: "denied" },
  { time: "14:25:33", actor: "crm-sync", resource: "customer_phone", purpose: "sync", operation: "read", status: "allowed" },
  { time: "14:24:10", actor: "analytics-job", resource: "aggregated_stats", purpose: "reporting", operation: "read", status: "allowed" },
  { time: "14:22:55", actor: "payout-service", resource: "bank_account", purpose: "payment", operation: "detokenize", status: "allowed" },
  { time: "14:21:40", actor: "support-app", resource: "pan", purpose: "manual review", operation: "detokenize", status: "denied" },
  { time: "14:20:02", actor: "identity-service", resource: "email", purpose: "auth", operation: "read", status: "allowed" },
  { time: "14:18:55", actor: "billing-job", resource: "card_last4", purpose: "invoicing", operation: "read", status: "allowed" },
  { time: "14:17:20", actor: "support-app", resource: "aadhaar", purpose: "user verification", operation: "detokenize", status: "denied" },
  { time: "14:15:41", actor: "report-service", resource: "aggregated_stats", purpose: "reporting", operation: "read", status: "allowed" },
  { time: "14:14:08", actor: "payout-service", resource: "bank_account", purpose: "payment", operation: "detokenize", status: "allowed" },
  { time: "14:12:33", actor: "crm-sync", resource: "customer_email", purpose: "sync", operation: "read", status: "allowed" },
  { time: "14:10:19", actor: "identity-service", resource: "phone", purpose: "auth", operation: "read", status: "allowed" },
  { time: "14:08:44", actor: "support-app", resource: "pan", purpose: "manual review", operation: "detokenize", status: "denied" },
  { time: "14:06:02", actor: "analytics-job", resource: "aggregated_stats", purpose: "reporting", operation: "read", status: "allowed" },
  { time: "14:04:27", actor: "billing-job", resource: "customer_phone", purpose: "invoicing", operation: "read", status: "allowed" },
  { time: "14:02:51", actor: "payout-service", resource: "bank_account", purpose: "payment", operation: "detokenize", status: "allowed" },
  { time: "14:01:15", actor: "report-service", resource: "aggregated_stats", purpose: "reporting", operation: "read", status: "allowed" },
  { time: "13:59:40", actor: "support-app", resource: "aadhaar", purpose: "user verification", operation: "read", status: "allowed" },
  { time: "13:58:05", actor: "crm-sync", resource: "customer_phone", purpose: "sync", operation: "read", status: "allowed" },
  { time: "13:56:22", actor: "identity-service", resource: "email", purpose: "auth", operation: "read", status: "allowed" },
  { time: "13:54:48", actor: "payout-service", resource: "bank_account", purpose: "payment", operation: "detokenize", status: "allowed" },
  { time: "13:53:11", actor: "support-app", resource: "pan", purpose: "manual review", operation: "detokenize", status: "denied" },
  { time: "13:51:35", actor: "analytics-job", resource: "aggregated_stats", purpose: "reporting", operation: "read", status: "allowed" },
  { time: "13:49:58", actor: "billing-job", resource: "card_last4", purpose: "invoicing", operation: "read", status: "allowed" },
  { time: "13:48:20", actor: "report-service", resource: "aggregated_stats", purpose: "reporting", operation: "read", status: "allowed" },
  { time: "13:46:44", actor: "crm-sync", resource: "customer_email", purpose: "sync", operation: "read", status: "allowed" },
  { time: "13:45:07", actor: "payout-service", resource: "bank_account", purpose: "payment", operation: "detokenize", status: "allowed" },
  { time: "13:43:31", actor: "identity-service", resource: "phone", purpose: "auth", operation: "read", status: "allowed" },
  { time: "13:41:55", actor: "support-app", resource: "aadhaar", purpose: "user verification", operation: "detokenize", status: "allowed" },
  { time: "13:40:18", actor: "support-app", resource: "pan", purpose: "manual review", operation: "detokenize", status: "denied" },
  { time: "13:38:42", actor: "analytics-job", resource: "aggregated_stats", purpose: "reporting", operation: "read", status: "allowed" },
  { time: "13:37:05", actor: "billing-job", resource: "customer_phone", purpose: "invoicing", operation: "read", status: "allowed" },
  { time: "13:35:29", actor: "payout-service", resource: "bank_account", purpose: "payment", operation: "detokenize", status: "allowed" },
  { time: "13:33:52", actor: "report-service", resource: "aggregated_stats", purpose: "reporting", operation: "read", status: "allowed" },
  { time: "13:32:16", actor: "crm-sync", resource: "customer_phone", purpose: "sync", operation: "read", status: "allowed" },
  { time: "13:30:40", actor: "identity-service", resource: "email", purpose: "auth", operation: "read", status: "allowed" },
  { time: "13:29:03", actor: "support-app", resource: "aadhaar", purpose: "user verification", operation: "read", status: "allowed" },
  { time: "13:27:27", actor: "payout-service", resource: "bank_account", purpose: "payment", operation: "detokenize", status: "allowed" },
  { time: "13:25:50", actor: "support-app", resource: "pan", purpose: "manual review", operation: "detokenize", status: "denied" },
  { time: "13:24:14", actor: "analytics-job", resource: "aggregated_stats", purpose: "reporting", operation: "read", status: "allowed" },
  { time: "13:22:38", actor: "billing-job", resource: "card_last4", purpose: "invoicing", operation: "read", status: "allowed" },
  { time: "13:21:01", actor: "report-service", resource: "aggregated_stats", purpose: "reporting", operation: "read", status: "allowed" },
  { time: "13:19:25", actor: "crm-sync", resource: "customer_email", purpose: "sync", operation: "read", status: "allowed" },
  { time: "13:17:49", actor: "payout-service", resource: "bank_account", purpose: "payment", operation: "detokenize", status: "allowed" },
  { time: "13:16:12", actor: "identity-service", resource: "phone", purpose: "auth", operation: "read", status: "allowed" },
];

// ----- Data Discovery assets (each references one of orgDataSources by name) -----
const sourceToType: Record<string, DataAssetSourceType> = {
  "Cloud Storage": "cloud",
  "Relational Database": "database",
  "NoSQL Database": "database",
  "Data Warehouse": "database",
  "Cache": "database",
  "Event Streaming": "database",
  "File Storage": "file",
  "Search Engine": "server",
};

export function getOrgAssets(): DataAsset[] {
  const classifications: Record<DataAssetType, string[]> = {
    pii: ["Email", "Phone", "SSN", "Address"],
    phi: ["Medical ID", "Diagnosis", "Prescription"],
    pci: ["Credit Card", "CVV", "Expiry Date"],
    credentials: ["API Keys", "Tokens", "Passwords"],
    financial: ["Revenue", "Projections", "Margins"],
    general: ["Session ID", "User Agent"],
  };
  const assets: DataAsset[] = [];
  let id = 1;
  for (const src of orgDataSources) {
    if (src.sensitiveRecords === 0) continue;
    const sourceType = sourceToType[src.type] ?? "database";
    const riskLevels: DataAssetRiskLevel[] = ["critical", "high", "medium", "low"];
    const risk = riskLevels[id % 4];
    const types: DataAssetType[] = ["pii", "pci", "phi", "credentials", "financial", "general"];
    const type = types[id % 6];
    const statuses: DataAssetStatus[] = ["active", "investigating", "resolved"];
    assets.push({
      id: String(id++),
      name: `${src.name.toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_")}_data`,
      type,
      source: src.name,
      sourceType,
      location: `${src.name.split(" - ")[0]?.toLowerCase() ?? "db"}.${src.id}`,
      riskLevel: risk,
      recordCount: Math.min(src.sensitiveRecords, 500000),
      lastScanned: src.lastSync,
      status: statuses[id % 3],
      classification: classifications[type],
    });
  }
  // Add a few more assets per source for org-scale feel
  const extra = [
    { name: "customer_profiles", type: "pii" as DataAssetType, source: orgDataSources[0].name, location: "customers.profiles", riskLevel: "critical" as DataAssetRiskLevel, recordCount: 145000, classification: ["Email", "Phone", "SSN"] },
    { name: "payment_transactions", type: "pci" as DataAssetType, source: orgDataSources[1].name, location: "s3://finance-data/transactions/", riskLevel: "critical" as DataAssetRiskLevel, recordCount: 89000, classification: ["Credit Card", "CVV"] },
    { name: "employee_records", type: "pii" as DataAssetType, source: orgDataSources[2].name, location: "hr_db.employees", riskLevel: "high" as DataAssetRiskLevel, recordCount: 12500, classification: ["SSN", "Salary"] },
    { name: "medical_claims", type: "phi" as DataAssetType, source: orgDataSources[13].name, location: "healthcare.claims", riskLevel: "critical" as DataAssetRiskLevel, recordCount: 67000, classification: ["Medical ID", "Diagnosis"] },
    { name: "api_keys_backup", type: "credentials" as DataAssetType, source: orgDataSources[4].name, location: "gs://backup-vault/secrets/", riskLevel: "critical" as DataAssetRiskLevel, recordCount: 342, classification: ["API Keys", "Tokens"] },
    { name: "quarterly_reports", type: "financial" as DataAssetType, source: orgDataSources[14].name, location: "/Finance/Reports/Q4-2024/", riskLevel: "medium" as DataAssetRiskLevel, recordCount: 156, classification: ["Revenue", "Margins"] },
    { name: "vendor_contracts", type: "pii" as DataAssetType, source: orgDataSources[6].name, location: "s3://legal-docs/vendors/", riskLevel: "high" as DataAssetRiskLevel, recordCount: 2340, classification: ["Contact Info", "Tax ID"] },
    { name: "identity_tokens", type: "credentials" as DataAssetType, source: orgDataSources[16].name, location: "identity.tokens", riskLevel: "critical" as DataAssetRiskLevel, recordCount: 450000, classification: ["Tokens", "Hashes"] },
  ];
  extra.forEach((e, i) => {
    const src = orgDataSources.find((s) => s.name === e.source);
    assets.push({
      id: String(id++),
      name: e.name,
      type: e.type,
      source: e.source,
      sourceType: src?.type.includes("Cloud") ? "cloud" : src?.type.includes("File") ? "file" : "database",
      location: e.location,
      riskLevel: e.riskLevel,
      recordCount: e.recordCount,
      lastScanned: "2 hours ago",
      status: "active",
      classification: e.classification,
    });
  });
  return assets;
}

// ----- Derived totals (so Dashboard stats match organization) -----
export const totalSensitiveRecords = orgDataSources.reduce((sum, s) => sum + s.sensitiveRecords, 0);
export const totalDataSourcesCount = orgDataSources.length;
export const totalAlertsCount = orgAlerts.length;
