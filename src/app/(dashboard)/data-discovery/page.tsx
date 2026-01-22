"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, Badge, Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { formatNumber, dataTypeIcons } from "@/lib/utils";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Database,
  Server,
  Cloud,
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

// Types
interface SensitiveDataRecord {
  id: string;
  name: string;
  type: "pii" | "phi" | "pci" | "credentials" | "financial" | "general";
  source: string;
  sourceType: "database" | "cloud" | "file";
  location: string;
  riskLevel: "critical" | "high" | "medium" | "low";
  recordCount: number;
  lastScanned: string;
  status: "active" | "resolved" | "investigating";
  classification: string[];
}

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: "connected" | "syncing" | "error" | "pending";
  lastSync: string;
  totalRecords: number;
  sensitiveRecords: number;
  icon: React.ElementType;
}

// Mock Data
const sensitiveDataRecords: SensitiveDataRecord[] = [
  {
    id: "1",
    name: "customer_profiles",
    type: "pii",
    source: "PostgreSQL - Production",
    sourceType: "database",
    location: "customers.profiles",
    riskLevel: "critical",
    recordCount: 145000,
    lastScanned: "2 hours ago",
    status: "active",
    classification: ["Email", "Phone", "SSN", "Address"],
  },
  {
    id: "2",
    name: "payment_transactions",
    type: "pci",
    source: "AWS S3 - Finance Bucket",
    sourceType: "cloud",
    location: "s3://finance-data/transactions/",
    riskLevel: "critical",
    recordCount: 89000,
    lastScanned: "30 min ago",
    status: "investigating",
    classification: ["Credit Card", "CVV", "Expiry Date"],
  },
  {
    id: "3",
    name: "employee_records",
    type: "pii",
    source: "MongoDB - HR Database",
    sourceType: "database",
    location: "hr_db.employees",
    riskLevel: "high",
    recordCount: 12500,
    lastScanned: "1 hour ago",
    status: "active",
    classification: ["SSN", "Salary", "Bank Account"],
  },
  {
    id: "4",
    name: "medical_claims",
    type: "phi",
    source: "Snowflake - Healthcare",
    sourceType: "database",
    location: "healthcare.claims",
    riskLevel: "critical",
    recordCount: 67000,
    lastScanned: "45 min ago",
    status: "active",
    classification: ["Medical ID", "Diagnosis", "Prescription"],
  },
  {
    id: "5",
    name: "api_keys_backup",
    type: "credentials",
    source: "Google Cloud Storage",
    sourceType: "cloud",
    location: "gs://backup-vault/secrets/",
    riskLevel: "critical",
    recordCount: 342,
    lastScanned: "15 min ago",
    status: "investigating",
    classification: ["API Keys", "Tokens", "Passwords"],
  },
  {
    id: "6",
    name: "quarterly_reports",
    type: "financial",
    source: "SharePoint - Finance",
    sourceType: "file",
    location: "/Finance/Reports/Q4-2024/",
    riskLevel: "medium",
    recordCount: 156,
    lastScanned: "3 hours ago",
    status: "resolved",
    classification: ["Revenue", "Projections", "Margins"],
  },
  {
    id: "7",
    name: "user_sessions",
    type: "general",
    source: "Redis - Cache",
    sourceType: "database",
    location: "cache:sessions:*",
    riskLevel: "low",
    recordCount: 890000,
    lastScanned: "5 min ago",
    status: "active",
    classification: ["Session ID", "User Agent"],
  },
  {
    id: "8",
    name: "vendor_contracts",
    type: "pii",
    source: "AWS S3 - Legal",
    sourceType: "cloud",
    location: "s3://legal-docs/vendors/",
    riskLevel: "high",
    recordCount: 2340,
    lastScanned: "2 hours ago",
    status: "active",
    classification: ["Contact Info", "Tax ID", "Bank Details"],
  },
];

const dataSources: DataSource[] = [
  {
    id: "1",
    name: "PostgreSQL Production",
    type: "Relational Database",
    status: "connected",
    lastSync: "2 min ago",
    totalRecords: 2400000,
    sensitiveRecords: 157500,
    icon: Database,
  },
  {
    id: "2",
    name: "AWS S3",
    type: "Cloud Storage",
    status: "syncing",
    lastSync: "Syncing...",
    totalRecords: 890000,
    sensitiveRecords: 89342,
    icon: Cloud,
  },
  {
    id: "3",
    name: "MongoDB Atlas",
    type: "NoSQL Database",
    status: "connected",
    lastSync: "5 min ago",
    totalRecords: 1200000,
    sensitiveRecords: 12500,
    icon: Server,
  },
  {
    id: "4",
    name: "Google Cloud Storage",
    type: "Cloud Storage",
    status: "connected",
    lastSync: "15 min ago",
    totalRecords: 456000,
    sensitiveRecords: 342,
    icon: Cloud,
  },
];

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

const sourceTypeIcons = {
  database: Database,
  cloud: Cloud,
  file: FileText,
};

const statusConfig = {
  connected: { color: "success" as const, icon: CheckCircle },
  syncing: { color: "info" as const, icon: RefreshCw },
  error: { color: "danger" as const, icon: AlertTriangle },
  pending: { color: "warning" as const, icon: Clock },
};

const recordStatusConfig = {
  active: { color: "danger" as const, label: "Active" },
  investigating: { color: "warning" as const, label: "Investigating" },
  resolved: { color: "success" as const, label: "Resolved" },
};

const riskLevelColors = {
  critical: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  high: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500",
  },
  medium: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    dot: "bg-yellow-500",
  },
  low: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
  },
};

// SortIcon component moved outside to avoid recreating during render
const SortIcon = ({ 
  field, 
  sortField, 
  sortDirection 
}: { 
  field: string; 
  sortField: string; 
  sortDirection: "asc" | "desc";
}) => {
  if (sortField !== field) return <ChevronDown className="w-4 h-4 opacity-30" />;
  return sortDirection === "desc" ? (
    <ChevronDown className="w-4 h-4 text-[#036E6E]" />
  ) : (
    <ChevronUp className="w-4 h-4 text-[#036E6E]" />
  );
};

export default function DataDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"riskLevel" | "recordCount" | "lastScanned">("riskLevel");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort data
  const filteredData = sensitiveDataRecords
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

  const handleSort = (field: "riskLevel" | "recordCount" | "lastScanned") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Data Discovery"
        subtitle="Discover and classify sensitive data across your infrastructure"
      />

      <div className="p-6 space-y-6">
        {/* Data Sources Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {dataSources.map((source, index) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden" hover>
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10" />
                <CardContent className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <source.icon className="w-5 h-5 text-slate-500" />
                    </div>
                    <Badge
                      variant={statusConfig[source.status].color}
                      size="sm"
                      dot
                    >
                      {source.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{source.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{source.type}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">
                      {formatNumber(source.sensitiveRecords)} sensitive
                    </span>
                    <span className="text-slate-400">{source.lastSync}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card padding="lg">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Input
                  placeholder="Search by name, source, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                />
              </div>

              {/* Filter Toggle */}
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                icon={<Filter className="w-4 h-4" />}
              >
                Filters
                {(typeFilter !== "all" || riskFilter !== "all" || statusFilter !== "all") && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-emerald-100 text-[#024443] text-xs flex items-center justify-center">
                    {[typeFilter, riskFilter, statusFilter].filter((f) => f !== "all").length}
                  </span>
                )}
              </Button>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="secondary" icon={<RefreshCw className="w-4 h-4" />}>
                  Scan Now
                </Button>
                <Button variant="secondary" icon={<Download className="w-4 h-4" />}>
                  Export
                </Button>
              </div>
            </div>

            {/* Expanded Filters */}
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
                    {/* Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Data Type
                      </label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 focus:border-[#036E6E] focus:ring-1 focus:ring-[#036E6E]/20 transition-all outline-none text-sm"
                      >
                        {typeFilters.map((filter) => (
                          <option key={filter.value} value={filter.value}>
                            {filter.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Risk Filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Risk Level
                      </label>
                      <select
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 focus:border-[#036E6E] focus:ring-1 focus:ring-[#036E6E]/20 transition-all outline-none text-sm"
                      >
                        {riskFilters.map((filter) => (
                          <option key={filter.value} value={filter.value}>
                            {filter.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 focus:border-[#036E6E] focus:ring-1 focus:ring-[#036E6E]/20 transition-all outline-none text-sm"
                      >
                        {statusFilters.map((filter) => (
                          <option key={filter.value} value={filter.value}>
                            {filter.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <p className="text-sm text-slate-500">
            Showing <span className="text-slate-700 font-medium">{filteredData.length}</span> of{" "}
            <span className="text-slate-700 font-medium">{sensitiveDataRecords.length}</span> records
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

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">
                      Data Asset
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">
                      Source
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">
                      Type
                    </th>
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
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">
                      Status
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record, index) => {
                    const SourceIcon = sourceTypeIcons[record.sourceType];
                    const riskColors = riskLevelColors[record.riskLevel];
                    const isExpanded = expandedRow === record.id;

                    return (
                      <React.Fragment key={record.id}>
                        <motion.tr
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                            isExpanded ? "bg-slate-50" : ""
                          }`}
                          onClick={() => setExpandedRow(isExpanded ? null : record.id)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{dataTypeIcons[record.type]}</span>
                              <div>
                                <p className="font-medium text-slate-800">{record.name}</p>
                                <p className="text-xs text-slate-500 truncate max-w-[200px]">
                                  {record.location}
                                </p>
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
                              <span className={`text-sm font-medium capitalize ${riskColors.text}`}>
                                {record.riskLevel}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-700 font-medium">
                              {formatNumber(record.recordCount)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={recordStatusConfig[record.status].color} size="sm" dot>
                              {recordStatusConfig[record.status].label}
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

                        {/* Expanded Row */}
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
                                  {/* Classifications */}
                                  <div>
                                    <h4 className="text-sm font-medium text-slate-600 mb-3">
                                      Data Classifications
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {record.classification.map((cls) => (
                                        <Badge key={cls} variant="default" size="sm">
                                          {cls}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Details */}
                                  <div>
                                    <h4 className="text-sm font-medium text-slate-600 mb-3">
                                      Details
                                    </h4>
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

                                  {/* Quick Actions */}
                                  <div>
                                    <h4 className="text-sm font-medium text-slate-600 mb-3">
                                      Quick Actions
                                    </h4>
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

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              <p className="text-sm text-slate-500">
                Page 1 of 1
              </p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="secondary" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Help Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
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
              <Button
                variant="primary"
                icon={<Play className="w-4 h-4" />}
              >
                Run AI Classification
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
