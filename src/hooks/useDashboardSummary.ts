"use client";

import { useEffect, useState } from "react";
import { api } from "@/core/api";
import type { ApiError, DashboardSummary } from "@/core/api";

export interface UseDashboardSummaryResult {
  data: DashboardSummary | null;
  error: ApiError | null;
  loading: boolean;
  refetch: () => void;
}

export function useDashboardSummary(): UseDashboardSummaryResult {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    api.dashboard
      .getSummary()
      .then((result) => {
        if ("error" in result) {
          setError(result.error);
          setData(null);
        } else {
          setData(result.data);
          setError(null);
        }
      })
      .catch((err) => {
        setError({ code: "FETCH_ERROR", message: err?.message ?? "Failed to load dashboard" });
        setData(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, error, loading, refetch: fetchData };
}
