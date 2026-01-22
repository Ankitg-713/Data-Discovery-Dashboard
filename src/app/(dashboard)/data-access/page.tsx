"use client";

import React from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "@/components/ui";
import {
  Unlock,
  Ban,
  Timer,
  Eye,
  ShieldAlert,
  Zap,
  XCircle,
} from "lucide-react";

/* -------------------- Mock Metrics -------------------- */
type AccessOperation = "read" | "detokenize";
type AccessStatus = "allowed" | "denied";

interface AccessLog {
  time: string;
  actor: string;
  resource: string;
  purpose: string;
  operation: AccessOperation;
  status: AccessStatus;
}


const accessMetrics = [
  {
    label: "Detokenization Requests (1h)",
    value: "1,000",
    icon: Unlock,
    color: "text-[#036E6E]",
  },
  {
    label: "Denied Requests",
    value: "15",
    icon: Ban,
    color: "text-red-600",
  },
  {
    label: "Avg Latency",
    value: "1s",
    icon: Timer,
    color: "text-emerald-600",
  },
];

/* -------------------- Access Logs -------------------- */

const accessLogs: AccessLog[] = [
  {
    time: "14:30:11",
    actor: "payout-service",
    resource: "bank_account",
    purpose: "payment",
    operation: "detokenize",
    status: "allowed",
  },
  {
    time: "14:28:42",
    actor: "support-app",
    resource: "aadhaar",
    purpose: "user verification",
    operation: "read",
    status: "allowed",
  },
  {
    time: "14:27:05",
    actor: "support-app",
    resource: "pan",
    purpose: "manual review",
    operation: "detokenize",
    status: "denied",
  },
];

/* -------------------- Anomaly -------------------- */

const anomaly = {
  ip: "10.0.4.15",
  service: "Support_App",
  rate: ">5k/min",
};

/* -------------------- Motion -------------------- */

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

/* -------------------- Helpers -------------------- */

const statusBadge: Record<AccessStatus, "success" | "danger"> = {
  allowed: "success",
  denied: "danger",
};

const operationBadge: Record<AccessOperation, "info" | "purple"> = {
  read: "info",
  detokenize: "purple",
};

/* -------------------- Page -------------------- */

export default function DataAccessPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Data Access"
        subtitle="Monitor and control access to sensitive data in real time"
      />

      <div className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* ---------------- Metrics ---------------- */}
          <motion.div variants={itemVariants}>
            <Card padding="lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {accessMetrics.map((metric) => (
                  <div key={metric.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                      <metric.icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{metric.label}</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {metric.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* ---------------- Access Logs ---------------- */}
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
                      <th className="px-6 py-3 text-left text-sm text-slate-600">
                        User / Service
                      </th>
                      <th className="px-6 py-3 text-left text-sm text-slate-600">
                        PII / File Requested
                      </th>
                      <th className="px-6 py-3 text-left text-sm text-slate-600">
                        Purpose
                      </th>
                      <th className="px-6 py-3 text-left text-sm text-slate-600">
                        Operation
                      </th>
                      <th className="px-6 py-3 text-left text-sm text-slate-600">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {accessLogs.map((log, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {log.time}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {log.actor}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {log.resource}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {log.purpose}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={operationBadge[log.operation]}
                            size="sm"
                          >
                            {log.operation}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={statusBadge[log.status]}
                            size="sm"
                            dot
                          >
                            {log.status}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          {/* ---------------- Anomaly Detection ---------------- */}
          <motion.div variants={itemVariants}>
            <Card
              padding="lg"
              className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-red-200"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center shadow-lg">
                    <ShieldAlert className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      Anomaly Detected
                    </p>
                    <p className="text-sm text-slate-600">
                      IP {anomaly.ip} ({anomaly.service}) requesting high-volume
                      detokenization ({anomaly.rate})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="secondary" icon={<Eye className="w-4 h-4" />}>
                    Investigate
                  </Button>
                  <Button
                    variant="secondary"
                    icon={<Zap className="w-4 h-4" />}
                  >
                    Kill Session
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                    icon={<XCircle className="w-4 h-4" />}
                  >
                    Auto-Block
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
