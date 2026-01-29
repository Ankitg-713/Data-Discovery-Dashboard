"use client";

import { useState, useEffect, useRef } from "react";
import type { BackfillJobDetail } from "@/core/api/types";

/** Parse "42.1M" or "45k" to numeric value (millions or thousands). */
function parseCount(s: string): number {
  const n = parseFloat(s.replace(/[^0-9.]/g, ""));
  if (s.toUpperCase().includes("M")) return n * 1e6;
  if (s.toUpperCase().includes("K")) return n * 1e3;
  return n;
}

/** Format number as "42.1M" or "45k" style. */
function formatCount(n: number, style: "M" | "k" = "M"): string {
  if (style === "M") return `${(n / 1e6).toFixed(1)}M`;
  return `${Math.round(n / 1e3)}k`;
}

const TICK_MS = 1500;
const PROGRESS_STEP = 1.5;

export interface UseSimulatedBackfillProgressOptions {
  /** Initial job from API. When null, returns null. */
  initialJob: BackfillJobDetail | null;
  /** When false, returns initialJob unchanged (no simulation). */
  enabled: boolean;
}

/**
 * In demo mode, simulates live backfill progress: progress %, processed count,
 * and batch id advance over time until 100%. Gives a real-time feel without
 * touching the real API.
 */
export function useSimulatedBackfillProgress({
  initialJob,
  enabled,
}: UseSimulatedBackfillProgressOptions): BackfillJobDetail | null {
  const [job, setJob] = useState<BackfillJobDetail | null>(initialJob);
  const progressRef = useRef(initialJob?.progress ?? 0);

  useEffect(() => {
    setJob(initialJob);
    progressRef.current = initialJob?.progress ?? 0;
  }, [initialJob?.table, initialJob?.engine]);

  useEffect(() => {
    if (!enabled || !initialJob) {
      setJob(initialJob);
      return;
    }

    const totalNum = parseCount(initialJob.total);
    const formatStyle = initialJob.total.toUpperCase().includes("K") ? "k" : "M";
    const batchMatch = initialJob.batch.match(/(\d+)/);
    const batchStart = batchMatch ? parseInt(batchMatch[1], 10) : 4001;

    const initialProgress = initialJob.progress ?? 0;

    const id = setInterval(() => {
      progressRef.current = Math.min(100, progressRef.current + PROGRESS_STEP);
      const progress = progressRef.current;
      const processedNum = (totalNum * progress) / 100;
      const chunkDelta = Math.max(0, Math.floor((progress - initialProgress) * 0.4));
      const batchId = batchStart + chunkDelta;

      setJob({
        ...initialJob,
        progress: Math.round(progress * 10) / 10,
        processed: formatCount(processedNum, formatStyle),
        batch: initialJob.batch.replace(/\d+/, String(batchId)),
      });
    }, TICK_MS);

    return () => clearInterval(id);
  }, [enabled, initialJob]);

  return job;
}
