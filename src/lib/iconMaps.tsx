"use client";

import type { LucideIcon } from "lucide-react";
import {
  Database,
  Shield,
  AlertTriangle,
  Eye,
  FileWarning,
  Server,
  Cloud,
  Activity,
  Cpu,
  Unlock,
  Ban,
  Timer,
  FileText,
} from "lucide-react";
import type { StatIconKey } from "@/core/api";

export const statIconMap: Record<StatIconKey, LucideIcon> = {
  database: Database,
  shield: Shield,
  alertTriangle: AlertTriangle,
  eye: Eye,
};

const dataSourceIconMap: Record<"cloud" | "server" | "database", LucideIcon> = {
  cloud: Cloud,
  server: Server,
  database: Database,
};

export function getDataSourceIcon(iconKey: "cloud" | "server" | "database"): LucideIcon {
  return dataSourceIconMap[iconKey] ?? Database;
}

export const alertIconMap: Record<string, LucideIcon> = {
  fileWarning: FileWarning,
  alertTriangle: AlertTriangle,
  shield: Shield,
  database: Database,
};

export const piiDensityIconMap: Record<string, LucideIcon> = {
  database: Database,
  server: Server,
  cloud: Cloud,
};

export const backfillIconMap: Record<string, LucideIcon> = {
  activity: Activity,
  database: Database,
  cpu: Cpu,
};

export const dataAccessIconMap: Record<string, LucideIcon> = {
  unlock: Unlock,
  ban: Ban,
  timer: Timer,
};

export const sourceTypeIconMap: Record<"database" | "cloud" | "file", LucideIcon> = {
  database: Database,
  cloud: Cloud,
  file: FileText,
};
