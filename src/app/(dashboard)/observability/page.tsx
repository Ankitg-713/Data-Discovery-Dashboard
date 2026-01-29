"use client";

import React from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Skeleton } from "@/components/ui";
import { Database, Server, Cloud, ShieldAlert, Lock, CheckCircle, RefreshCw, Activity } from "lucide-react";
import { piiDensityIconMap } from "@/lib/iconMaps";
import { useObservabilityMetrics } from "@/hooks";

const riskStyles: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const piiStatusConfig: Record<string, { color: "success" | "info" | "default"; icon: typeof CheckCircle }> = {
  connected: { color: "success", icon: CheckCircle },
  syncing: { color: "info", icon: RefreshCw },
  active: { color: "default", icon: Activity },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function ObservabilityPage() {
  const { data, error, loading, refetch } = useObservabilityMetrics();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Observability" subtitle="Real-time visibility into sensitive data movement" />
        <div className="p-6 space-y-6">
          <Card padding="lg" className="bg-slate-100/50">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-5 flex-1 max-w-md rounded" />
            </div>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="lg">
              <Skeleton className="h-5 w-24 mb-2 rounded" />
              <Skeleton className="h-4 w-56 mb-4 rounded" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-20 mb-2 rounded" />
                      <Skeleton className="h-3 w-24 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card padding="lg">
              <Skeleton className="h-5 w-40 mb-2 rounded" />
              <Skeleton className="h-4 w-48 mb-4 rounded" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                    <Skeleton className="h-2.5 w-2.5 rounded-full mt-1" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-1 rounded" />
                      <Skeleton className="h-3 w-16 rounded font-mono" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Card padding="none">
            <div className="px-6 py-4 border-b border-slate-200">
              <Skeleton className="h-5 w-44 rounded" />
            </div>
            <div className="p-6 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 flex-1 rounded" />
                  <Skeleton className="h-10 flex-1 rounded" />
                  <Skeleton className="h-10 w-20 rounded" />
                  <Skeleton className="h-10 w-16 rounded" />
                  <Skeleton className="h-10 w-24 rounded" />
                </div>
              ))}
            </div>
          </Card>
          <Card padding="lg" className="bg-slate-50">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div>
                <Skeleton className="h-5 w-40 mb-2 rounded" />
                <Skeleton className="h-4 w-64 rounded" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Observability" subtitle="Real-time visibility into sensitive data movement" />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <Card padding="lg" className="max-w-md">
            <div className="text-center">
              <p className="text-red-600 font-medium mb-2">{error.message}</p>
              <p className="text-sm text-slate-500 mb-4">Code: {error.code}</p>
              <Button onClick={refetch}>Try again</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { criticalDetectionsCount, criticalDetectionsWindowMinutes, piiDensitySources, liveDiscoveryEvents, enforcementActions } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Observability" subtitle="Real-time visibility into sensitive data movement" />

      <div className="p-6 space-y-6">
        <motion.div variants={itemVariants} initial="hidden" animate="show">
          <Card padding="lg" className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-red-100">
            <div className="flex items-center gap-4">
              <ShieldAlert className="w-6 h-6 text-red-600" />
              <p className="text-sm text-slate-700">
                <span className="font-semibold text-red-600">{criticalDetectionsCount} critical detections</span> identified in the last {criticalDetectionsWindowMinutes} minutes across production systems
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>PII Density</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">Sensitive data concentration by source</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {piiDensitySources.map((source) => {
                      const Icon = piiDensityIconMap[source.iconKey] ?? Database;
                      const statusCfg = source.status ? piiStatusConfig[source.status] : null;
                      const StatusIcon = statusCfg?.icon ?? CheckCircle;
                      return (
                        <div
                          key={source.name}
                          className="relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:shadow-md transition-all"
                        >
                          <div
                            className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-3xl opacity-30 ${
                              source.risk === "critical" ? "bg-red-400" : source.risk === "medium" ? "bg-yellow-400" : "bg-green-400"
                            }`}
                          />
                          <div className="relative w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-slate-600" />
                          </div>
                          <div className="relative flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-700 truncate">{source.name}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${riskStyles[source.risk]}`} />
                              <span className="text-xs text-slate-500 capitalize">{source.risk} exposure</span>
                              {source.status && (
                                <Badge variant={statusCfg?.color ?? "success"} size="sm" className="shrink-0">
                                  <StatusIcon className="w-3 h-3 mr-0.5 inline" />
                                  {source.status}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Live Discovery (Runtime)</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">Real-time sensitive data detections</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
                    {liveDiscoveryEvents.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border-l-4"
                        style={{
                          borderLeftColor:
                            event.severity === "critical" ? "#ef4444" : event.severity === "high" ? "#f97316" : "#eab308",
                        }}
                      >
                        <span className={`mt-1 w-2.5 h-2.5 rounded-full ${riskStyles[event.severity]} animate-pulse`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700">{event.message}</p>
                          <p className="text-xs text-slate-400 mt-0.5 font-mono">{event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <Card padding="none">
              <CardHeader className="px-6 py-4 border-b border-slate-200">
                <CardTitle>Enforcement & Actions</CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm text-slate-600">Resource</th>
                      <th className="px-6 py-3 text-left text-sm text-slate-600">Column</th>
                      <th className="px-6 py-3 text-left text-sm text-slate-600">Type</th>
                      <th className="px-6 py-3 text-left text-sm text-slate-600">Confidence</th>
                      <th className="px-6 py-3 text-left text-sm text-slate-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enforcementActions.map((row, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 text-sm text-slate-700">{row.resource}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{row.column}</td>
                        <td className="px-6 py-4">
                          <Badge variant="purple" size="sm">
                            {row.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: row.confidence }} />
                            </div>
                            <span className="text-sm font-medium text-slate-700">{row.confidence}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={row.action.includes("BACKFILL") ? "warning" : "success"} size="sm">
                            {row.action}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card padding="lg" className="bg-gradient-to-r from-emerald-50 via-teal-50 to-purple-50 border-emerald-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#024443] to-[#036E6E] flex items-center justify-center shadow-lg">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Runtime Protection Active</p>
                  <p className="text-sm text-slate-500">All critical detections are being enforced in real time</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
