import React from "react";

export interface Integration {
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

export type IntegrationStatus = Integration["status"];
export type IntegrationCategory = Integration["category"];
