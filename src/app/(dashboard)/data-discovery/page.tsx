"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, Badge, Button, Skeleton } from "@/components/ui";
import { Input } from "@/components/ui";
import { formatNumber, dataTypeIcons } from "@/lib/utils";
import { getDataSourceIcon, sourceTypeIconMap } from "@/lib/iconMaps";
import { useDataDiscovery } from "@/hooks";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Database,
  FileText,
  Eye,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreVertical,
  ExternalLink,
  Trash2,
  Copy,
  Play,
} from "lucide-react";

const typeFilters = [
  { value: "all", label: "All Types" },
  { value: "pii", label: "PII" },
  { value: "phi", label: "PHI" },
  { value: "pci", label: "PCI" },
  { value: "credentials", label: "Credentials" },
  { value: "financial", label: "Financial" },
];

const riskFilters = [
  { value: "all", label: "All Risk Levels" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const statusFilters = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "investigating", label: "Investigating" },
  { value: "resolved", label: "Resolved" },
];

const statusConfig: Record<string, { color: "success" | "info" | "danger" | "warning"; icon: React.ElementType }> = {
  connected: { color: "success", icon: CheckCircle },
  syncing: { color: "info", icon: RefreshCw },
  error: { color: "danger", icon: AlertTriangle },
  pending: { color: "warning", icon: Clock },
};

const recordStatusConfig: Record<string, { color: "danger" | "warning" | "success"; label: string }> = {
  active: { color: "danger", label: "Active" },
  investigating: { color: "warning", label: "Investigating" },
  resolved: { color: "success", label: "Resolved" },
};

const riskLevelColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  critical: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
  high: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
  medium: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500" },
  low: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
};

function SortIcon({
  field,
  sortField,
  sortDirection,
}: {
  field: string;
  sortField: string;
  sortDirection: "asc" | "desc";
}) {
  if (sortField !== field) return <ChevronDown className="w-4 h-4 opacity-30" />;
  return sortDirection === "desc" ? (
    <ChevronDown className="w-4 h-4 text-[#036E6E]" />
  ) : (
    <ChevronUp className="w-4 h-4 text-[#036E6E]" />
  );
}

export default function DataDiscoveryPage() {
  const { data, error, loading, refetch } = useDataDiscovery();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"riskLevel" | "recordCount" | "lastScanned">("riskLevel");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredData = useMemo(() => {
    if (!data?.assets) return [];
    return data.assets
      .filter((record) => {
        const matchesSearch =
          record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === "all" || record.type === typeFilter;
        const matchesRisk = riskFilter === "all" || record.riskLevel === riskFilter;
        const matchesStatus = statusFilter === "all" || record.status === statusFilter;
        return matchesSearch && matchesType && matchesRisk && matchesStatus;
      })
      .sort((a, b) => {
        const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        if (sortField === "riskLevel") {
          const diff = riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
          return sortDirection === "desc" ? -diff : diff;
        }
        if (sortField === "recordCount") {
          const diff = a.recordCount - b.recordCount;
          return sortDirection === "desc" ? -diff : diff;
        }
        return 0;
      });
  }, [data?.assets, searchQuery, typeFilter, riskFilter, statusFilter, sortField, sortDirection]);

  const handleSort = (field: "riskLevel" | "recordCount" | "lastScanned") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Data Discovery" subtitle="Discover and classify sensitive data across your infrastructure" />
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} padding="md">
                <div className="flex items-start justify-between mb-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-5 w-32 mb-2 rounded" />
                <Skeleton className="h-3 w-24 mb-3 rounded" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-3 w-14 rounded" />
                </div>
              </Card>
            ))}
          </div>
          <Card padding="lg">
            <div className="flex flex-col lg:flex-row gap-4">
              <Skeleton className="h-11 flex-1 rounded-xl" />
              <Skeleton className="h-11 w-24 rounded-xl" />
              <div className="flex gap-2">
                <Skeleton className="h-11 w-28 rounded-xl" />
                <Skeleton className="h-11 w-24 rounded-xl" />
              </div>
            </div>
          </Card>
          <Card padding="none">
            <div className="overflow-x-auto">
              <div className="px-6 py-4 border-b border-slate-200 flex gap-4">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <Skeleton key={i} className="h-4 flex-1 min-w-[80px] rounded" />
                ))}
              </div>
              <div className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                ))}
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
        <Header title="Data Discovery" subtitle="Discover and classify sensitive data across your infrastructure" />
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

  const { sources, assets } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Data Discovery" subtitle="Discover and classify sensitive data across your infrastructure" />

      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-x-auto pb-2 scrollbar-thin -mx-1 px-1">
          <div className="flex gap-4 flex-nowrap min-h-0">
            {sources.map((source, index) => {
              const SourceIcon = getDataSourceIcon(source.iconKey);
              const config = statusConfig[source.status];
              return (
                <motion.div key={source.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="shrink-0 w-[280px]">
                  <Card className="relative overflow-hidden h-full" hover>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10" />
                    <CardContent className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          <SourceIcon className="w-5 h-5 text-slate-500" />
                        </div>
                        <Badge variant={config?.color ?? "default"} size="sm" dot>
                          {source.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-slate-800 mb-1 truncate" title={source.name}>{source.name}</h3>
                      <p className="text-xs text-slate-500 mb-3">{source.type}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">{formatNumber(source.sensitiveRecords)} sensitive</span>
                        <span className="text-slate-400 shrink-0 ml-1">{source.lastSync}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card padding="lg">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, source, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                />
              </div>
              <Button variant="secondary" onClick={() => setShowFilters(!showFilters)} icon={<Filter className="w-4 h-4" />}>
                Filters
                {(typeFilter !== "all" || riskFilter !== "all" || statusFilter !== "all") && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-emerald-100 text-[#024443] text-xs flex items-center justify-center">
                    {[typeFilter, riskFilter, statusFilter].filter((f) => f !== "all").length}
                  </span>
                )}
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="secondary" icon={<RefreshCw className="w-4 h-4" />}>Scan Now</Button>
                <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Export</Button>
              </div>
            </div>
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 mt-4 border-t border-slate-200">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Data Type</label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 focus:border-[#036E6E] focus:ring-1 focus:ring-[#036E6E]/20 transition-all outline-none text-sm"
                      >
                        {typeFilters.map((f) => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Risk Level</label>
                      <select
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 focus:border-[#036E6E] focus:ring-1 focus:ring-[#036E6E]/20 transition-all outline-none text-sm"
                      >
                        {riskFilters.map((f) => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 focus:border-[#036E6E] focus:ring-1 focus:ring-[#036E6E]/20 transition-all outline-none text-sm"
                      >
                        {statusFilters.map((f) => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="text-slate-700 font-medium">{filteredData.length}</span> of{" "}
            <span className="text-slate-700 font-medium">{assets.length}</span> records
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2 text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              {filteredData.filter((r) => r.riskLevel === "critical").length} Critical
            </span>
            <span className="flex items-center gap-2 text-orange-600">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              {filteredData.filter((r) => r.riskLevel === "high").length} High
            </span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Data Asset</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Source</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Type</th>
                    <th
                      className="text-left px-6 py-4 text-sm font-medium text-slate-600 cursor-pointer hover:text-slate-800 transition-colors"
                      onClick={() => handleSort("riskLevel")}
                    >
                      <div className="flex items-center gap-1">
                        Risk Level
                        <SortIcon field="riskLevel" sortField={sortField} sortDirection={sortDirection} />
                      </div>
                    </th>
                    <th
                      className="text-left px-6 py-4 text-sm font-medium text-slate-600 cursor-pointer hover:text-slate-800 transition-colors"
                      onClick={() => handleSort("recordCount")}
                    >
                      <div className="flex items-center gap-1">
                        Records
                        <SortIcon field="recordCount" sortField={sortField} sortDirection={sortDirection} />
                      </div>
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record, index) => {
                    const SourceIcon = sourceTypeIconMap[record.sourceType];
                    const riskColors = riskLevelColors[record.riskLevel];
                    const isExpanded = expandedRow === record.id;
                    const statusCfg = recordStatusConfig[record.status];
                    return (
                      <React.Fragment key={record.id}>
                        <motion.tr
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? "bg-slate-50" : ""}`}
                          onClick={() => setExpandedRow(isExpanded ? null : record.id)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{dataTypeIcons[record.type]}</span>
                              <div>
                                <p className="font-medium text-slate-800">{record.name}</p>
                                <p className="text-xs text-slate-500 truncate max-w-[200px]">{record.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <SourceIcon className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-slate-600">{record.source}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="purple" size="sm">
                              {record.type.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${riskColors.dot}`} />
                              <span className={`text-sm font-medium capitalize ${riskColors.text}`}>{record.riskLevel}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-700 font-medium">{formatNumber(record.recordCount)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={statusCfg.color} size="sm" dot>
                              {statusCfg.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                                <Shield className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-slate-50"
                            >
                              <td colSpan={7} className="px-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div>
                                    <h4 className="text-sm font-medium text-slate-600 mb-3">Data Classifications</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {record.classification.map((cls) => (
                                        <Badge key={cls} variant="default" size="sm">
                                          {cls}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-slate-600 mb-3">Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Last Scanned</span>
                                        <span className="text-slate-700">{record.lastScanned}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Source Type</span>
                                        <span className="text-slate-700 capitalize">{record.sourceType}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Records Found</span>
                                        <span className="text-slate-700">{formatNumber(record.recordCount)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-slate-600 mb-3">Quick Actions</h4>
                                    <div className="flex flex-wrap gap-2">
                                      <Button variant="secondary" size="sm" icon={<Play className="w-3 h-3" />}>
                                        Re-scan
                                      </Button>
                                      <Button variant="secondary" size="sm" icon={<Copy className="w-3 h-3" />}>
                                        Copy Path
                                      </Button>
                                      <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3 h-3" />}>
                                        View Source
                                      </Button>
                                      <Button variant="ghost" size="sm" icon={<Trash2 className="w-3 h-3" />} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                        Ignore
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              <p className="text-sm text-slate-500">Page 1 of 1</p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" disabled>Previous</Button>
                <Button variant="secondary" size="sm" disabled>Next</Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-gradient-to-r from-purple-50 via-teal-50 to-emerald-50 border-purple-100" padding="lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-[#036E6E] flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Need help with classification?</h3>
                  <p className="text-sm text-slate-500">
                    Our AI-powered classifier can automatically detect and categorize sensitive data
                  </p>
                </div>
              </div>
              <Button variant="primary" icon={<Play className="w-4 h-4" />}>
                Run AI Classification
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
