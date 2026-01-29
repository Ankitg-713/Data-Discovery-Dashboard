"use client";

import React from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Skeleton } from "@/components/ui";
import { Activity, Database, Cpu, CheckCircle2, Clock } from "lucide-react";
import { backfillIconMap } from "@/lib/iconMaps";
import { useBackfill, useSimulatedBackfillProgress } from "@/hooks";
import { DEMO_MODE } from "@/core/config";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function BackfillTokenizationPage() {
  const { data, error, loading, refetch } = useBackfill();
  const simulatedJob = useSimulatedBackfillProgress({
    initialJob: data?.activeJob ?? null,
    enabled: DEMO_MODE,
  });
  // Show section whenever API has activeJob; use simulated values in demo when ready, else API job
  const activeJob = data?.activeJob
    ? (DEMO_MODE ? (simulatedJob ?? data.activeJob) : data.activeJob)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Backfill Tokenization" subtitle="Controlled tokenization of historical sensitive data" />
        <div className="p-6 space-y-6">
          <Card padding="lg">
            <Skeleton className="h-5 w-44 mb-2 rounded" />
            <Skeleton className="h-4 w-56 mb-4 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div>
                    <Skeleton className="h-3 w-20 mb-2 rounded" />
                    <Skeleton className="h-5 w-24 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <Skeleton className="h-4 w-32 mb-2 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
                <Skeleton className="h-4 w-40 rounded" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-4 w-36 rounded" />
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <Skeleton className="h-3 w-24 mb-2 rounded" />
                    <Skeleton className="h-4 w-28 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card padding="lg" className="bg-slate-50">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div>
                <Skeleton className="h-5 w-44 mb-2 rounded" />
                <Skeleton className="h-4 w-80 rounded" />
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
        <Header title="Backfill Tokenization" subtitle="Controlled tokenization of historical sensitive data" />
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

  const { orchestratorStats } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Backfill Tokenization" subtitle="Controlled tokenization of historical sensitive data" />

      <div className="p-6">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Backfill Orchestrator</CardTitle>
                <p className="text-sm text-slate-500 mt-1">System-wide backfill execution metrics</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {orchestratorStats.map((stat) => {
                    const Icon = backfillIconMap[stat.iconKey] ?? Activity;
                    return (
                      <div
                        key={stat.label}
                        className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">{stat.label}</p>
                          <p className="text-lg font-semibold text-slate-800">{String(stat.value)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {activeJob && (
            <motion.div variants={itemVariants}>
              <Card padding="lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Active Backfill Job</CardTitle>
                    <Badge variant="info" size="sm" dot>
                      Running
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Table: {activeJob.table}</p>
                      <p className="text-xs text-slate-500">Engine: {activeJob.engine}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      Committing {activeJob.commit}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-600">Rows Processed</p>
                      <p className="text-sm font-medium text-slate-700">
                        {activeJob.processed} / {activeJob.total} ({activeJob.progress}%)
                      </p>
                    </div>
                    <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${activeJob.progress}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-[#024443] to-[#036E6E]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Current Batch</p>
                      <p className="text-sm font-medium text-slate-700">{activeJob.batch}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Avg Latency</p>
                      <p className="text-sm font-medium text-slate-700">{activeJob.latency}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Resource Impact</p>
                      <p className="text-sm font-medium text-slate-700">{activeJob.impact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <Card padding="lg" className="bg-gradient-to-r from-emerald-50 via-teal-50 to-purple-50 border-emerald-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#024443] to-[#036E6E] flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Safe Backfill Execution</p>
                  <p className="text-sm text-slate-500">
                    Tokenization is throttled and isolated to prevent production impact
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
