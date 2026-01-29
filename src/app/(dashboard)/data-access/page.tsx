"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, Badge, Button, Skeleton } from "@/components/ui";
import { Unlock, Ban, Timer, Eye, ShieldAlert, Zap, XCircle } from "lucide-react";
import { dataAccessIconMap } from "@/lib/iconMaps";
import { useDataAccess } from "@/hooks";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const statusBadge: Record<"allowed" | "denied", "success" | "danger"> = {
  allowed: "success",
  denied: "danger",
};

const operationBadge: Record<"read" | "detokenize", "info" | "purple"> = {
  read: "info",
  detokenize: "purple",
};

const metricColorClasses: Record<"primary" | "danger" | "success", string> = {
  primary: "text-[#036E6E]",
  danger: "text-red-600",
  success: "text-emerald-600",
};

const PAGE_SIZE = 10;

export default function DataAccessPage() {
  const { data, error, loading, refetch } = useDataAccess();
  const [currentPage, setCurrentPage] = useState(1);

  const logs = data?.logs ?? [];
  const totalPages = Math.ceil(logs.length / PAGE_SIZE) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const pageLogs = useMemo(
    () => logs.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [logs, safePage]
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(1);
  }, [totalPages, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Data Access" subtitle="Monitor and control access to sensitive data in real time" />
        <div className="p-6 space-y-6">
          <Card padding="lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div>
                    <Skeleton className="h-4 w-40 mb-2 rounded" />
                    <Skeleton className="h-8 w-16 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card padding="none">
            <div className="px-6 py-4 border-b border-slate-200">
              <Skeleton className="h-5 w-36 rounded" />
            </div>
            <div className="overflow-x-auto">
              <div className="px-6 py-3 border-b border-slate-200 flex gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-4 flex-1 min-w-[70px] rounded" />
                ))}
              </div>
              <div className="divide-y divide-slate-100">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="px-6 py-4 flex gap-4">
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card padding="lg" className="bg-slate-50">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div>
                <Skeleton className="h-5 w-32 mb-2 rounded" />
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
        <Header title="Data Access" subtitle="Monitor and control access to sensitive data in real time" />
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

  const { metrics, anomaly } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Data Access" subtitle="Monitor and control access to sensitive data in real time" />

      <div className="p-6">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card padding="lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((metric) => {
                  const Icon = dataAccessIconMap[metric.iconKey];
                  const colorClass = metricColorClasses[metric.colorKey];
                  return (
                    <div key={metric.label} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${colorClass}`} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">{metric.label}</p>
                        <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card padding="none">
              <CardHeader className="px-6 py-4 border-b border-slate-200">
                <CardTitle>Data Access Logs</CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm text-slate-600">Time</th>
                      <th className="px-6 py-3 text-left text-sm text-slate-600">User / Service</th>
                      <th className="px-6 py-3 text-left text-sm text-slate-600">PII / File Requested</th>
                      <th className="px-6 py-3 text-left text-sm text-slate-600">Purpose</th>
                      <th className="px-6 py-3 text-left text-sm text-slate-600">Operation</th>
                      <th className="px-6 py-3 text-left text-sm text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageLogs.map((log, index) => (
                      <motion.tr
                        key={(safePage - 1) * PAGE_SIZE + index}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 text-sm text-slate-700">{log.time}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{log.actor}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{log.resource}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{log.purpose}</td>
                        <td className="px-6 py-4">
                          <Badge variant={operationBadge[log.operation]} size="sm">
                            {log.operation}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={statusBadge[log.status]} size="sm" dot>
                            {log.status}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                <p className="text-sm text-slate-500">
                  Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, logs.length)} of {logs.length} logs
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-600 px-2">
                    Page {safePage} of {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {anomaly && (
            <motion.div variants={itemVariants}>
              <Card padding="lg" className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-red-200">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center shadow-lg">
                      <ShieldAlert className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Anomaly Detected</p>
                      <p className="text-sm text-slate-600">
                        IP {anomaly.ip} ({anomaly.service}) requesting high-volume detokenization ({anomaly.rate})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" icon={<Eye className="w-4 h-4" />}>
                      Investigate
                    </Button>
                    <Button variant="secondary" icon={<Zap className="w-4 h-4" />}>
                      Kill Session
                    </Button>
                    <Button variant="ghost" className="text-red-600 hover:bg-red-50" icon={<XCircle className="w-4 h-4" />}>
                      Auto-Block
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
