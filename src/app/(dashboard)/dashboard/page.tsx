"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Skeleton } from "@/components/ui";
import { DataChart, type DataPoint } from "@/components/charts/DataChart";
import { formatNumber } from "@/lib/utils";
import { statIconMap, getDataSourceIcon, alertIconMap } from "@/lib/iconMaps";
import { useDashboardSummary } from "@/hooks";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Server,
  Cloud,
  Lock,
  Users,
  Activity,
  Shield,
  Database,
} from "lucide-react";

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

// Simple fade-in so content is always visible (no variant opacity issues)
const pageTransition = { opacity: 1, transition: { duration: 0.25 } };

export default function DashboardPage() {
  const { data, error, loading, refetch } = useDashboardSummary();
  const dataSourcesRef = useRef<HTMLDivElement>(null);
  const recentAlertsRef = useRef<HTMLDivElement>(null);
  const riskDistributionRef = useRef<HTMLDivElement>(null);
  const dataClassificationRef = useRef<HTMLDivElement>(null);
  const [highlightDataSources, setHighlightDataSources] = useState(false);
  const [highlightAlerts, setHighlightAlerts] = useState(false);
  const [highlightRiskDistribution, setHighlightRiskDistribution] = useState(false);
  const [highlightDataClassification, setHighlightDataClassification] = useState(false);
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState<string>("");

  const scrollToDataSources = () => {
    dataSourcesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      setHighlightDataSources(true);
      setTimeout(() => setHighlightDataSources(false), 2500);
    }, 500);
  };

  const scrollToAlerts = () => {
    recentAlertsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      setHighlightAlerts(true);
      setTimeout(() => setHighlightAlerts(false), 2500);
    }, 500);
  };

  const scrollToRiskDistribution = () => {
    riskDistributionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      setHighlightRiskDistribution(true);
      setTimeout(() => setHighlightRiskDistribution(false), 2500);
    }, 500);
  };

  const scrollToDataClassification = () => {
    dataClassificationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      setHighlightDataClassification(true);
      setTimeout(() => setHighlightDataClassification(false), 2500);
    }, 500);
  };

  const lastUpdatedAt = data?.lastUpdatedAt;
  useEffect(() => {
    if (lastUpdatedAt == null) {
      setLastUpdatedLabel("");
      return;
    }
    const update = () => {
      const sec = Math.floor((Date.now() - lastUpdatedAt) / 1000);
      if (sec < 60) setLastUpdatedLabel(`Last updated ${sec}s ago`);
      else setLastUpdatedLabel(`Last updated ${Math.floor(sec / 60)}m ago`);
    };
    update();
    const id = setInterval(update, 3000);
    return () => clearInterval(id);
  }, [lastUpdatedAt]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Dashboard" subtitle="Monitor your data security in real-time" />
        <div className="p-6 space-y-6">
          {/* Stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} padding="md" className="overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <Skeleton className="h-5 w-12 rounded" />
                </div>
                <Skeleton className="h-4 w-24 mb-2 rounded" />
                <Skeleton className="h-9 w-20 rounded" />
              </Card>
            ))}
          </div>
          {/* Charts row skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card padding="lg" className="lg:col-span-2">
              <Skeleton className="h-5 w-40 mb-2 rounded" />
              <Skeleton className="h-4 w-64 mb-4 rounded" />
              <Skeleton className="h-[280px] w-full rounded-xl" />
            </Card>
            <Card padding="lg">
              <Skeleton className="h-5 w-36 mb-2 rounded" />
              <Skeleton className="h-4 w-48 mb-4 rounded" />
              <Skeleton className="h-[200px] w-full rounded-xl" />
            </Card>
          </div>
          {/* Bottom row skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card padding="lg">
              <Skeleton className="h-5 w-28 mb-4 rounded" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-2 rounded" />
                      <Skeleton className="h-3 w-24 rounded" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </Card>
            <Card padding="lg">
              <Skeleton className="h-5 w-32 mb-2 rounded" />
              <Skeleton className="h-4 w-48 mb-4 rounded" />
              <Skeleton className="h-[200px] w-full rounded-xl" />
            </Card>
            <Card padding="lg">
              <Skeleton className="h-5 w-28 mb-4 rounded" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1 rounded" />
                      <Skeleton className="h-3 w-20 rounded" />
                    </div>
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
          {/* Security bar skeleton */}
          <Card padding="lg" className="bg-slate-50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <div>
                  <Skeleton className="h-5 w-32 mb-2 rounded" />
                  <Skeleton className="h-4 w-48 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-8">
                <Skeleton className="h-10 w-16 rounded" />
                <Skeleton className="h-12 w-px bg-slate-200" />
                <div className="flex items-center gap-6">
                  <Skeleton className="h-8 w-12 rounded" />
                  <Skeleton className="h-8 w-12 rounded" />
                  <Skeleton className="h-8 w-14 rounded" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    const isDemoOff = error.code === "NOT_IMPLEMENTED";
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Dashboard" subtitle="Monitor your data security in real-time" />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <Card padding="lg" className="max-w-md">
            <div className="text-center">
              <p className="text-red-600 font-medium mb-2">{error.message}</p>
              <p className="text-sm text-slate-500 mb-4">Code: {error.code}</p>
              {isDemoOff && (
                <p className="text-sm text-slate-600 mb-4">
                  Use demo mode: set <code className="bg-slate-100 px-1 rounded">NEXT_PUBLIC_DEMO_MODE=true</code> in <code className="bg-slate-100 px-1 rounded">.env.local</code> and restart the dev server.
                </p>
              )}
              <Button onClick={refetch}>Try again</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Defensive: ensure arrays exist so maps never crash
  const stats = data.stats ?? [];
  const accessTrend = data.accessTrend ?? [];
  const classification = data.classification ?? [];
  const riskDistribution = data.riskDistribution ?? [];
  const recentAlerts = data.recentAlerts ?? [];
  const dataSources = data.dataSources ?? [];
  const securityScore = data.securityScore ?? 0;
  const securityUsersCount = data.securityUsersCount ?? 0;
  const securityUptimePercent = data.securityUptimePercent ?? 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Dashboard" subtitle="Monitor your data security in real-time" />
      {lastUpdatedLabel && (
        <p className="px-6 pt-1 text-xs text-slate-500" aria-live="polite">
          {lastUpdatedLabel}
        </p>
      )}
      <div className="p-6">
        <motion.div initial={{ opacity: 0 }} animate={pageTransition} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const colors = colorClasses[stat.color as keyof typeof colorClasses] ?? colorClasses.cyan;
              const StatIcon = statIconMap[stat.iconKey as keyof typeof statIconMap] ?? Database;
              const isClickable =
                stat.title === "Total Data Sources" ||
                stat.title === "Security Alerts" ||
                stat.title === "Sensitive Records" ||
                stat.title === "Active Scans";
              const handleClick =
                stat.title === "Total Data Sources"
                  ? scrollToDataSources
                  : stat.title === "Security Alerts"
                    ? scrollToAlerts
                    : stat.title === "Sensitive Records"
                      ? scrollToRiskDistribution
                      : stat.title === "Active Scans"
                        ? scrollToDataClassification
                        : undefined;
              return (
                <div
                  key={stat.title}
                  onClick={handleClick}
                  className={isClickable ? "cursor-pointer" : ""}
                >
                  <Card className="relative overflow-hidden" hover>
                    <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} rounded-full blur-3xl -mr-16 -mt-16 opacity-50`} />
                    <CardContent className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl ${colors.icon} flex items-center justify-center shadow-lg`}>
                          <StatIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${stat.changeType === "increase" ? "text-emerald-600" : "text-red-600"}`}>
                          {stat.changeType === "increase" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span>{Math.abs(stat.change)}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-800">{formatNumber(stat.value)}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card padding="lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Data Access Trends</CardTitle>
                      <p className="text-sm text-slate-500 mt-1">Weekly access patterns across all data sources</p>
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
                  <div className="min-h-[280px]">
                    <DataChart data={accessTrend as DataPoint[]} type="area" colors={["#036E6E", "#8b5cf6"]} height={280} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div ref={dataClassificationRef}>
              <Card
                padding="lg"
                className={`h-full transition-all duration-300 ${highlightDataClassification ? "ring-2 ring-[#036E6E] ring-offset-2 animate-highlight-blink" : ""}`}
              >
                <CardHeader>
                  <CardTitle>Data Classification</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">Breakdown by sensitivity type</p>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[200px]">
                    <DataChart data={classification as DataPoint[]} type="pie" colors={["#036E6E", "#8b5cf6", "#10b981", "#f59e0b", "#94a3b8"]} height={200} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {classification.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: ["#036E6E", "#8b5cf6", "#10b981", "#f59e0b", "#94a3b8"][index] }}
                        />
                        <span className="text-xs text-slate-500">{item.name}</span>
                        <span className="text-xs text-slate-700 ml-auto font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-1 min-h-0 flex flex-col max-h-[360px]" ref={recentAlertsRef}>
              <Card
                padding="lg"
                className={`h-full min-h-0 flex flex-col transition-all duration-300 ${highlightAlerts ? "ring-2 ring-amber-500 ring-offset-2 animate-highlight-blink-amber" : ""}`}
              >
                <CardHeader className="shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Alerts</CardTitle>
                    <button className="text-sm text-[#036E6E] hover:text-[#024443] transition-colors flex items-center gap-1">
                      View all <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="min-h-0 flex-1 overflow-hidden flex flex-col">
                  <div className="space-y-3 overflow-y-auto pr-1 min-h-0 max-h-[280px] scrollbar-thin">
                    {recentAlerts.map((alert) => {
                      const AlertIcon = alertIconMap[alert.iconKey] ?? Database;
                      const sev = severityColors[alert.severity] ?? severityColors.info;
                      return (
                        <motion.div
                          key={alert.id}
                          whileHover={{ x: 4 }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <div
                            className={`w-9 h-9 rounded-lg ${sev.badge === "danger" ? "bg-red-100" : sev.badge === "warning" ? "bg-amber-100" : "bg-emerald-100"} flex items-center justify-center`}
                          >
                            <AlertIcon
                              className={`w-4 h-4 ${sev.badge === "danger" ? "text-red-600" : sev.badge === "warning" ? "text-amber-600" : "text-[#036E6E]"}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">{alert.title}</p>
                            <p className="text-xs text-slate-500">{alert.source}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={sev.badge} size="sm">
                              {alert.severity}
                            </Badge>
                            <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="min-h-0 flex flex-col max-h-[360px]" ref={riskDistributionRef}>
              <Card
                padding="lg"
                className={`h-full min-h-0 flex flex-col transition-all duration-300 ${highlightRiskDistribution ? "ring-2 ring-[#036E6E] ring-offset-2 animate-highlight-blink" : ""}`}
              >
                <CardHeader className="shrink-0">
                  <CardTitle>Risk Distribution</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">Current risk levels across assets</p>
                </CardHeader>
                <CardContent className="min-h-0 flex-1 overflow-hidden flex flex-col">
                  <div className="min-h-[160px] shrink-0">
                    <DataChart data={riskDistribution as DataPoint[]} type="bar" colors={["#ef4444", "#f97316", "#eab308", "#22c55e"]} height={160} showGrid={false} />
                  </div>
                  <div className="mt-4 space-y-2 overflow-y-auto pr-1 min-h-0 max-h-[120px] scrollbar-thin">
                    {riskDistribution.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: ["#ef4444", "#f97316", "#eab308", "#22c55e"][index] }}
                          />
                          <span className="text-sm text-slate-500">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-700">{item.value} assets</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="min-h-0 flex flex-col max-h-[360px]" ref={dataSourcesRef}>
              <Card
                padding="lg"
                className={`h-full min-h-0 flex flex-col transition-all duration-300 ${highlightDataSources ? "ring-2 ring-[#036E6E] ring-offset-2 animate-highlight-blink" : ""}`}
              >
                <CardHeader className="shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle>Data Sources</CardTitle>
                    <button className="text-sm text-[#036E6E] hover:text-[#024443] transition-colors flex items-center gap-1">
                      Manage <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="min-h-0 flex-1 overflow-hidden flex flex-col">
                  <div className="space-y-3 overflow-y-auto pr-1 min-h-0 max-h-[280px] scrollbar-thin">
                    {dataSources.map((source) => {
                      const SourceIcon = getDataSourceIcon(source.iconKey);
                      return (
                        <div
                          key={source.name}
                          className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                            <SourceIcon className="w-5 h-5 text-slate-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700">{source.name}</p>
                            <p className="text-xs text-slate-500">{source.type}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={source.status === "active" ? "success" : "warning"} size="sm" dot>
                              {source.status}
                            </Badge>
                            <p className="text-xs text-slate-400 mt-1">{formatNumber(source.records)} records</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
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
                    <p className="text-3xl font-bold text-emerald-600">{securityScore}%</p>
                    <p className="text-xs text-slate-500">Overall Score</p>
                  </div>
                  <div className="h-12 w-px bg-slate-200" />
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#036E6E]" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">{securityUsersCount}</p>
                        <p className="text-xs text-slate-500">Users</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">{securityUptimePercent}%</p>
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
