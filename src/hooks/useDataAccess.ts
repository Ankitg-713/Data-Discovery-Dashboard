"use client";

import { useEffect, useState } from "react";
import { api } from "@/core/api";
import type { ApiError, DataAccessResponse } from "@/core/api";

export interface UseDataAccessResult {
  data: DataAccessResponse | null;
  error: ApiError | null;
  loading: boolean;
  refetch: () => void;
}

export function useDataAccess(): UseDataAccessResult {
  const [data, setData] = useState<DataAccessResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    api.dataAccess
      .getData()
      .then((result) => {
        if ("error" in result) {
          setError(result.error);
          setData(null);
        } else {
          setData(result.data);
          setError(null);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, error, loading, refetch: fetchData };
}
