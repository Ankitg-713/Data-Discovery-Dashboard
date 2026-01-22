"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";
import { DataChart } from "@/components/charts/DataChart";
import { formatNumber } from "@/lib/utils";
import {
  Shield,
  Database,
  AlertTriangle,
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  FileWarning,
  Server,
  Cloud,
  Lock,
  Users,
  Activity,
} from "lucide-react";

// Mock data for the dashboard
const statsCards = [
  {
    title: "Total Data Sources",
    value: 47,
    change: +12,
    changeType: "increase" as const,
    icon: Database,
    color: "cyan",
  },
  {
    title: "Sensitive Records",
    value: 2847392,
    change: +23,
    changeType: "increase" as const,
    icon: Shield,
    color: "purple",
  },
  {
    title: "Security Alerts",
    value: 23,
    change: -8,
    changeType: "decrease" as const,
    icon: AlertTriangle,
    color: "amber",
  },
  {
    title: "Active Scans",
    value: 12,
    change: +5,
    changeType: "increase" as const,
    icon: Eye,
    color: "emerald",
  },
];

const accessTrendData = [
  { name: "Mon", value: 1200, value2: 900 },
  { name: "Tue", value: 1800, value2: 1200 },
  { name: "Wed", value: 1400, value2: 1100 },
  { name: "Thu", value: 2200, value2: 1600 },
  { name: "Fri", value: 1900, value2: 1400 },
  { name: "Sat", value: 800, value2: 600 },
  { name: "Sun", value: 600, value2: 400 },
];

const dataClassificationData = [
  { name: "PII", value: 45 },
  { name: "PHI", value: 25 },
  { name: "PCI", value: 15 },
  { name: "Credentials", value: 10 },
  { name: "Other", value: 5 },
];

const riskDistributionData = [
  { name: "Critical", value: 12 },
  { name: "High", value: 28 },
  { name: "Medium", value: 45 },
  { name: "Low", value: 89 },
];

const recentAlerts = [
  {
    id: 1,
    title: "PII Exposure Detected",
    source: "AWS S3 Bucket",
    severity: "critical",
    time: "2 min ago",
    icon: FileWarning,
  },
  {
    id: 2,
    title: "Unusual Access Pattern",
    source: "PostgreSQL Database",
    severity: "high",
    time: "15 min ago",
    icon: AlertTriangle,
  },
  {
    id: 3,
    title: "New Sensitive Data Found",
    source: "Google Cloud Storage",
    severity: "medium",
    time: "1 hour ago",
    icon: Shield,
  },
  {
    id: 4,
    title: "Scan Completed",
    source: "MongoDB Atlas",
    severity: "info",
    time: "2 hours ago",
    icon: Database,
  },
];

const dataSources = [
  { name: "AWS S3", type: "Cloud Storage", status: "active", records: 1240000, icon: Cloud },
  { name: "PostgreSQL", type: "Database", status: "active", records: 890000, icon: Server },
  { name: "MongoDB", type: "NoSQL", status: "syncing", records: 450000, icon: Database },
  { name: "Snowflake", type: "Data Warehouse", status: "active", records: 267392, icon: Server },
  { name: "Azure Blob", type: "Cloud Storage", status: "active", records: 320000, icon: Cloud },
  { name: "MySQL", type: "Database", status: "active", records: 156000, icon: Database },
  { name: "Redis", type: "Cache", status: "syncing", records: 89000, icon: Server },
  { name: "Google BigQuery", type: "Data Warehouse", status: "active", records: 534000, icon: Database },
];

const colorClasses = {
  cyan: {
    bg: "bg-emerald-50",
    text: "text-[#036E6E]",
    icon: "bg-gradient-to-br from-[#024443] to-[#036E6E]",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    icon: "bg-gradient-to-br from-purple-500 to-purple-600",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    icon: "bg-gradient-to-br from-amber-500 to-amber-600",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    icon: "bg-gradient-to-br from-emerald-500 to-emerald-600",
  },
};

const severityColors: Record<string, { badge: "danger" | "warning" | "success" | "info" | "default"; dot: string }> = {
  critical: { badge: "danger", dot: "bg-red-500" },
  high: { badge: "warning", dot: "bg-orange-500" },
  medium: { badge: "default", dot: "bg-yellow-500" },
  info: { badge: "info", dot: "bg-[#036E6E]" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const dataSourcesRef = useRef<HTMLDivElement>(null);
  const recentAlertsRef = useRef<HTMLDivElement>(null);
  const riskDistributionRef = useRef<HTMLDivElement>(null);
  const dataClassificationRef = useRef<HTMLDivElement>(null);
  const [highlightDataSources, setHighlightDataSources] = useState(false);
  const [highlightAlerts, setHighlightAlerts] = useState(false);
  const [highlightRiskDistribution, setHighlightRiskDistribution] = useState(false);
  const [highlightDataClassification, setHighlightDataClassification] = useState(false);

  const scrollToDataSources = () => {
    dataSourcesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    
    // Trigger highlight after scroll animation completes
    setTimeout(() => {
      setHighlightDataSources(true);
      // Remove highlight after 2.5 seconds (matches animation duration)
      setTimeout(() => {
        setHighlightDataSources(false);
      }, 2500);
    }, 500);
  };

  const scrollToAlerts = () => {
    recentAlertsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    
    // Trigger highlight after scroll animation completes
    setTimeout(() => {
      setHighlightAlerts(true);
      // Remove highlight after 2.5 seconds (matches animation duration)
      setTimeout(() => {
        setHighlightAlerts(false);
      }, 2500);
    }, 500);
  };

  const scrollToRiskDistribution = () => {
    riskDistributionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    
    // Trigger highlight after scroll animation completes
    setTimeout(() => {
      setHighlightRiskDistribution(true);
      // Remove highlight after 2.5 seconds (matches animation duration)
      setTimeout(() => {
        setHighlightRiskDistribution(false);
      }, 2500);
    }, 500);
  };

  const scrollToDataClassification = () => {
    dataClassificationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    
    // Trigger highlight after scroll animation completes
    setTimeout(() => {
      setHighlightDataClassification(true);
      // Remove highlight after 2.5 seconds (matches animation duration)
      setTimeout(() => {
        setHighlightDataClassification(false);
      }, 2500);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Dashboard"
        subtitle="Monitor your data security in real-time"
      />

      <div className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {statsCards.map((stat, index) => {
              const colors = colorClasses[stat.color as keyof typeof colorClasses];
              const isClickable = stat.title === "Total Data Sources" || 
                                 stat.title === "Security Alerts" ||
                                 stat.title === "Sensitive Records" ||
                                 stat.title === "Active Scans";
              const handleClick = stat.title === "Total Data Sources" 
                ? scrollToDataSources 
                : stat.title === "Security Alerts" 
                  ? scrollToAlerts
                  : stat.title === "Sensitive Records"
                    ? scrollToRiskDistribution
                    : stat.title === "Active Scans"
                      ? scrollToDataClassification
                      : undefined;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={handleClick}
                  className={isClickable ? "cursor-pointer" : ""}
                >
                  <Card className="relative overflow-hidden" hover>
                    <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} rounded-full blur-3xl -mr-16 -mt-16 opacity-50`} />
                    <CardContent className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl ${colors.icon} flex items-center justify-center shadow-lg`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${
                          stat.changeType === "increase" ? "text-emerald-600" : "text-red-600"
                        }`}>
                          {stat.changeType === "increase" ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>{Math.abs(stat.change)}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-800">
                        {formatNumber(stat.value)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Access Trends Chart */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card padding="lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Data Access Trends</CardTitle>
                      <p className="text-sm text-slate-500 mt-1">
                        Weekly access patterns across all data sources
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#036E6E]" />
                        <span className="text-sm text-slate-500">Total Access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="text-sm text-slate-500">Sensitive</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <DataChart
                    data={accessTrendData}
                    type="area"
                    colors={["#036E6E", "#8b5cf6"]}
                    height={280}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Data Classification Pie chart */}
            <motion.div variants={itemVariants} ref={dataClassificationRef}>
              <Card 
                padding="lg" 
                className={`h-full transition-all duration-300 ${
                  highlightDataClassification 
                    ? "ring-2 ring-[#036E6E] ring-offset-2 animate-highlight-blink" 
                    : ""
                }`}
              >
                <CardHeader>
                  <CardTitle>Data Classification</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    Breakdown by sensitivity type
                  </p>
                </CardHeader>
                <CardContent>
                  <DataChart
                    data={dataClassificationData}
                    type="pie"
                    colors={["#036E6E", "#8b5cf6", "#10b981", "#f59e0b", "#94a3b8"]}
                    height={200}
                  />
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {dataClassificationData.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: ["#036E6E", "#8b5cf6", "#10b981", "#f59e0b", "#94a3b8"][index],
                          }}
                        />
                        <span className="text-xs text-slate-500">{item.name}</span>
                        <span className="text-xs text-slate-700 ml-auto font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Alerts */}
            <motion.div variants={itemVariants} className="lg:col-span-1" ref={recentAlertsRef}>
              <Card 
                padding="lg" 
                className={`h-full transition-all duration-300 ${
                  highlightAlerts 
                    ? "ring-2 ring-amber-500 ring-offset-2 animate-highlight-blink-amber" 
                    : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Alerts</CardTitle>
                    <button className="text-sm text-[#036E6E] hover:text-[#024443] transition-colors flex items-center gap-1">
                      View all <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentAlerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        whileHover={{ x: 4 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <div className={`w-9 h-9 rounded-lg ${severityColors[alert.severity].badge === "danger" ? "bg-red-100" : severityColors[alert.severity].badge === "warning" ? "bg-amber-100" : "bg-emerald-100"} flex items-center justify-center`}>
                          <alert.icon className={`w-4 h-4 ${severityColors[alert.severity].badge === "danger" ? "text-red-600" : severityColors[alert.severity].badge === "warning" ? "text-amber-600" : "text-[#036E6E]"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">
                            {alert.title}
                          </p>
                          <p className="text-xs text-slate-500">{alert.source}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={severityColors[alert.severity].badge} size="sm">
                            {alert.severity}
                          </Badge>
                          <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Risk Distribution */}
            <motion.div variants={itemVariants} ref={riskDistributionRef}>
              <Card 
                padding="lg" 
                className={`h-full transition-all duration-300 ${
                  highlightRiskDistribution 
                    ? "ring-2 ring-[#036E6E] ring-offset-2 animate-highlight-blink" 
                    : ""
                }`}
              >
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    Current risk levels across assets
                  </p>
                </CardHeader>
                <CardContent>
                  <DataChart
                    data={riskDistributionData}
                    type="bar"
                    colors={["#ef4444", "#f97316", "#eab308", "#22c55e"]}
                    height={200}
                    showGrid={false}
                  />
                  <div className="mt-4 space-y-2">
                    {riskDistributionData.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor: ["#ef4444", "#f97316", "#eab308", "#22c55e"][index],
                            }}
                          />
                          <span className="text-sm text-slate-500">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-700">{item.value} assets</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Data Sources Status */}
            <motion.div variants={itemVariants} ref={dataSourcesRef}>
              <Card 
                padding="lg" 
                className={`h-full transition-all duration-300 ${
                  highlightDataSources 
                    ? "ring-2 ring-[#036E6E] ring-offset-2 animate-highlight-blink" 
                    : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Data Sources</CardTitle>
                    <button className="text-sm text-[#036E6E] hover:text-[#024443] transition-colors flex items-center gap-1">
                      Manage <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
                    {dataSources.map((source) => (
                      <motion.div
                        key={source.name}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                          <source.icon className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700">{source.name}</p>
                          <p className="text-xs text-slate-500">{source.type}</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={source.status === "active" ? "success" : "warning"}
                            size="sm"
                            dot
                          >
                            {source.status}
                          </Badge>
                          <p className="text-xs text-slate-400 mt-1">
                            {formatNumber(source.records)} records
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Security Overview Bar */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-emerald-50 via-teal-50 to-purple-50 border-emerald-100" padding="lg">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#024443] to-[#036E6E] flex items-center justify-center shadow-lg shadow-[#036E6E]/20">
                    <Lock className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Security Score</h3>
                    <p className="text-sm text-slate-500">Your overall data security health</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-600">87%</p>
                    <p className="text-xs text-slate-500">Overall Score</p>
                  </div>
                  <div className="h-12 w-px bg-slate-200" />
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#036E6E]" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">234</p>
                        <p className="text-xs text-slate-500">Users</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">99.9%</p>
                        <p className="text-xs text-slate-500">Uptime</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">Active</p>
                        <p className="text-xs text-slate-500">Protection</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
