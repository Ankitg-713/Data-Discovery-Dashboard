"use client";

import React from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";
import {
  Database,
  Activity,
  Cpu,
  CheckCircle2,
  Clock,
} from "lucide-react";

/* ---------------- Mock Data ---------------- */

const orchestratorStats = [
  { label: "Active Jobs", value: 3, icon: Activity },
  { label: "Throughput", value: "45k rows/sec", icon: Database },
  { label: "CPU Cap", value: "2%", icon: Cpu },
];

const backfillJob = {
  table: "CUSTOMER_MASTER",
  engine: "Oracle 19c",
  progress: 82,
  processed: "42.1M",
  total: "51.2M",
  batch: "Chunk ID 4001",
  commit: "Every 2k rows",
  latency: "12ms / batch",
  impact: "8.4%",
};

/* ---------------- Animations ---------------- */

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/* ---------------- Page ---------------- */

export default function BackfillTokenizationPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Backfill Tokenization"
        subtitle="Controlled tokenization of historical sensitive data"
      />

      <div className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Orchestrator Overview */}
          <motion.div variants={itemVariants}>
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Backfill Orchestrator</CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  System-wide backfill execution metrics
                </p>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {orchestratorStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                        <p className="text-lg font-semibold text-slate-800">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Backfill Job */}
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
                {/* Job Meta */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Table: {backfillJob.table}
                    </p>
                    <p className="text-xs text-slate-500">
                      Engine: {backfillJob.engine}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    Committing {backfillJob.commit}
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-600">Rows Processed</p>
                    <p className="text-sm font-medium text-slate-700">
                      {backfillJob.processed} / {backfillJob.total} (
                      {backfillJob.progress}%)
                    </p>
                  </div>

                  <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${backfillJob.progress}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-[#024443] to-[#036E6E]"
                    />
                  </div>
                </div>

                {/* Job Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Current Batch</p>
                    <p className="text-sm font-medium text-slate-700">
                      {backfillJob.batch}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Avg Latency</p>
                    <p className="text-sm font-medium text-slate-700">
                      {backfillJob.latency}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">
                      Resource Impact
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      {backfillJob.impact}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer Insight */}
          <motion.div variants={itemVariants}>
            <Card
              padding="lg"
              className="bg-gradient-to-r from-emerald-50 via-teal-50 to-purple-50 border-emerald-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#024443] to-[#036E6E] flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    Safe Backfill Execution
                  </p>
                  <p className="text-sm text-slate-500">
                    Tokenization is throttled and isolated to prevent production
                    impact
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
