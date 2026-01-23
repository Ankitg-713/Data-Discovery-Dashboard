"use client";

import React from "react";
import { Card } from "@/components/ui";
import { Bell } from "lucide-react";

export function IntegrationsInfoCard() {
  return (
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
  );
}
