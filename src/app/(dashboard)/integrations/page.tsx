"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "@/components/ui";
import {
  MessageSquare,
  Mail,
  Bell,
  Zap,
  CheckCircle2,
  XCircle,
  Settings,
  ExternalLink,
  TestTube,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ---------------- Mock Data ---------------- */

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "connected" | "disconnected";
  category: "messaging" | "incident" | "email";
  webhookUrl?: string;
  channel?: string;
  apiKey?: string;
  lastTested?: string;
}

const integrations: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Send real-time alerts to Slack channels when sensitive data is detected",
    icon: MessageSquare,
    status: "disconnected",
    category: "messaging",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Get instant notifications in Microsoft Teams channels for security events",
    icon: MessageSquare,
    status: "disconnected",
    category: "messaging",
  },
  {
    id: "pagerduty",
    name: "PagerDuty",
    description: "Trigger PagerDuty incidents for critical data security alerts",
    icon: Bell,
    status: "disconnected",
    category: "incident",
  },
  {
    id: "opsgenie",
    name: "Opsgenie",
    description: "Create Opsgenie alerts for high-priority data discovery events",
    icon: Zap,
    status: "disconnected",
    category: "incident",
  },
  {
    id: "email",
    name: "Email (SMTP)",
    description: "Send email notifications via SMTP for alerts and daily summaries",
    icon: Mail,
    status: "disconnected",
    category: "email",
  },
];

/* ---------------- Styles ---------------- */

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

export default function IntegrationsPage() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [integrationsState, setIntegrationsState] = useState(integrations);

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleConnect = (id: string) => {
    setIntegrationsState((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, status: "connected" as const }
          : integration
      )
    );
  };

  const handleDisconnect = (id: string) => {
    setIntegrationsState((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, status: "disconnected" as const }
          : integration
      )
    );
    setExpandedCard(null);
  };

  const handleTest = (id: string) => {
    // Mock test notification
    const integration = integrationsState.find((i) => i.id === id);
    if (integration) {
      alert(`Test notification sent to ${integration.name}!`);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "messaging":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "incident":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "email":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Integrations"
        subtitle="Connect your alerting and notification services"
      />

      <div className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Info Card */}
          <motion.div variants={itemVariants}>
            <Card
              padding="lg"
              className="bg-gradient-to-r from-emerald-50 via-teal-50 to-purple-50 border-emerald-100"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#024443] to-[#036E6E] flex items-center justify-center shadow-lg">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-1">
                    Alerting & Notification Integrations
                  </h3>
                  <p className="text-sm text-slate-600">
                    Configure integrations to receive real-time alerts when sensitive data is
                    detected or security events occur. Get notified in your existing tools and
                    workflows.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrationsState.map((integration) => {
              const Icon = integration.icon;
              const isConnected = integration.status === "connected";
              const isExpanded = expandedCard === integration.id;

              return (
                <motion.div key={integration.id} variants={itemVariants}>
                  <Card padding="lg" className="h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isConnected
                              ? "bg-gradient-to-br from-[#024443] to-[#036E6E]"
                              : "bg-slate-100"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              isConnected ? "text-white" : "text-slate-500"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{integration.name}</h3>
                          <Badge
                            variant={isConnected ? "success" : "default"}
                            size="sm"
                            className="mt-1"
                          >
                            {isConnected ? "Connected" : "Not Connected"}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleExpand(integration.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-500" />
                        )}
                      </button>
                    </div>

                    <p className="text-sm text-slate-600 mb-4">{integration.description}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge
                        variant="default"
                        size="sm"
                        className={getCategoryColor(integration.category)}
                      >
                        {integration.category === "messaging"
                          ? "Messaging"
                          : integration.category === "incident"
                          ? "Incident Management"
                          : "Email"}
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {isConnected ? (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleTest(integration.id)}
                            icon={<TestTube className="w-4 h-4" />}
                            iconPosition="left"
                          >
                            Test
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => toggleExpand(integration.id)}
                            icon={<Settings className="w-4 h-4" />}
                            iconPosition="left"
                          >
                            Configure
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDisconnect(integration.id)}
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleConnect(integration.id)}
                          className="w-full"
                          icon={<ExternalLink className="w-4 h-4" />}
                          iconPosition="left"
                        >
                          Connect
                        </Button>
                      )}
                    </div>

                    {/* Expanded Configuration Panel */}
                    {isExpanded && isConnected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-slate-200"
                      >
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Webhook URL
                            </label>
                            <input
                              type="text"
                              placeholder="https://hooks.slack.com/services/..."
                              className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 focus:border-[#036E6E] focus:ring-1 focus:ring-[#036E6E]/20 transition-all outline-none text-sm"
                            />
                          </div>

                          {integration.category === "messaging" && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Channel / Room
                              </label>
                              <input
                                type="text"
                                placeholder="#alerts or @username"
                                className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 focus:border-[#036E6E] focus:ring-1 focus:ring-[#036E6E]/20 transition-all outline-none text-sm"
                              />
                            </div>
                          )}

                          {integration.category === "incident" && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                API Key
                              </label>
                              <input
                                type="password"
                                placeholder="Enter API key"
                                className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 focus:border-[#036E6E] focus:ring-1 focus:ring-[#036E6E]/20 transition-all outline-none text-sm"
                              />
                            </div>
                          )}

                          {integration.category === "email" && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  SMTP Server
                                </label>
                                <input
                                  type="text"
                                  placeholder="smtp.gmail.com"
                                  className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 focus:border-[#036E6E] focus:ring-1 focus:ring-[#036E6E]/20 transition-all outline-none text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Recipient Email
                                </label>
                                <input
                                  type="email"
                                  placeholder="alerts@company.com"
                                  className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 focus:border-[#036E6E] focus:ring-1 focus:ring-[#036E6E]/20 transition-all outline-none text-sm"
                                />
                              </div>
                            </>
                          )}

                          <div className="flex items-center gap-2 pt-2">
                            <Button variant="primary" size="sm">
                              Save Configuration
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleTest(integration.id)}
                              icon={<TestTube className="w-4 h-4" />}
                              iconPosition="left"
                            >
                              Send Test
                            </Button>
                          </div>

                          {integration.lastTested && (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span>Last tested: {integration.lastTested}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
