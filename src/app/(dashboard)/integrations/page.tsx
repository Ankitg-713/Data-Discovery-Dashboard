"use client";

import React from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { useIntegrations, IntegrationCard, IntegrationsInfoCard } from "@/features/integrations";

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
  const {
    integrations,
    expandedCards,
    toggleExpand,
    connect,
    disconnect,
    test,
  } = useIntegrations();

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
            <IntegrationsInfoCard />
          </motion.div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map((integration) => {
              const isExpanded = expandedCards.includes(integration.id);

              return (
                <motion.div key={integration.id} variants={itemVariants}>
                  <IntegrationCard
                    integration={integration}
                    isExpanded={isExpanded}
                    onToggleExpand={() => toggleExpand(integration.id)}
                    onConnect={() => connect(integration.id)}
                    onDisconnect={() => disconnect(integration.id)}
                    onTest={() => test(integration.id)}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
