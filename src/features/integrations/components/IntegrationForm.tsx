"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { CheckCircle2, TestTube } from "lucide-react";
import { Integration } from "../types/integration.types";

interface IntegrationFormProps {
  integration: Integration;
  onTest: () => void;
}

export function IntegrationForm({ integration, onTest }: IntegrationFormProps) {
  return (
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
            onClick={onTest}
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
  );
}
