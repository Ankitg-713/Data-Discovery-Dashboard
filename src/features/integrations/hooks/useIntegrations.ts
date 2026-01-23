import { useState } from "react";
import { Integration } from "../types/integration.types";
import { mockIntegrations } from "../data/mockIntegrations";

export function useIntegrations() {
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [integrationsState, setIntegrationsState] = useState<Integration[]>(mockIntegrations);

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  const connect = (id: string) => {
    setIntegrationsState((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, status: "connected" as const }
          : integration
      )
    );
    // Auto-expand configuration panel when connecting
    setExpandedCards((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const disconnect = (id: string) => {
    setIntegrationsState((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, status: "disconnected" as const }
          : integration
      )
    );
    // Close the configuration panel when disconnecting
    setExpandedCards((prev) => prev.filter((cardId) => cardId !== id));
  };

  const test = (id: string) => {
    // Mock test notification
    const integration = integrationsState.find((i) => i.id === id);
    if (integration) {
      alert(`Test notification sent to ${integration.name}!`);
    }
  };

  return {
    integrations: integrationsState,
    expandedCards,
    toggleExpand,
    connect,
    disconnect,
    test,
  };
}
