"use client";

import React from "react";
import { Card, Badge, Button } from "@/components/ui";
import { Settings, ExternalLink, TestTube } from "lucide-react";
import { Integration } from "../types/integration.types";
import { IntegrationForm } from "./IntegrationForm";

interface IntegrationCardProps {
  integration: Integration;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onTest: () => void;
}

export function IntegrationCard({
  integration,
  isExpanded,
  onToggleExpand,
  onConnect,
  onDisconnect,
  onTest,
}: IntegrationCardProps) {
  const Icon = integration.icon;
  const isConnected = integration.status === "connected";

  return (
    <Card padding="lg" className="h-full">
      <div className="flex items-start mb-4">
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
      </div>

      <p className="text-sm text-slate-600 mb-4">{integration.description}</p>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {isConnected ? (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={onTest}
              icon={<TestTube className="w-4 h-4" />}
              iconPosition="left"
            >
              Test
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onToggleExpand}
              icon={<Settings className="w-4 h-4" />}
              iconPosition="left"
            >
              Configure
            </Button>
            <Button variant="danger" size="sm" onClick={onDisconnect}>
              Disconnect
            </Button>
          </>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={onConnect}
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
        <IntegrationForm integration={integration} onTest={onTest} />
      )}
    </Card>
  );
}
