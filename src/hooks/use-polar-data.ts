"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  SleepData,
  RechargeData,
  ActivityData,
  ActivitySamplesData,
  HeartRateData,
  ExerciseData,
  CardioLoadData,
} from "@/types/polar";

interface PolarDataState {
  sleep: SleepData | null;
  recharge: RechargeData | null;
  activity: ActivityData | null;
  activitySamples: ActivitySamplesData | null;
  heartRate: HeartRateData | null;
  exercises: ExerciseData[] | null;
  cardioLoad: CardioLoadData | null;
  loading: boolean;
  error: string | null;
}

export function usePolarData(enabled: boolean) {
  const [data, setData] = useState<PolarDataState>({
    sleep: null,
    recharge: null,
    activity: null,
    activitySamples: null,
    heartRate: null,
    exercises: null,
    cardioLoad: null,
    loading: false,
    error: null,
  });

  const fetchAll = useCallback(async () => {
    if (!enabled) return;
    setData((d) => ({ ...d, loading: true, error: null }));
    try {
      const results = await Promise.allSettled([
        fetch("/api/proxy/sleep").then((r) => r.json()),
        fetch("/api/proxy/nightly-recharge").then((r) => r.json()),
        fetch("/api/proxy/activity").then((r) => r.json()),
        fetch("/api/proxy/activity-samples").then((r) => r.json()),
        fetch("/api/proxy/heart-rate").then((r) => r.json()),
        fetch("/api/proxy/exercises").then((r) => r.json()),
        fetch("/api/proxy/cardio-load").then((r) => r.json()),
      ]);

      setData({
        sleep: results[0].status === "fulfilled" ? results[0].value : null,
        recharge: results[1].status === "fulfilled" ? results[1].value : null,
        activity: results[2].status === "fulfilled" ? results[2].value : null,
        activitySamples: results[3].status === "fulfilled" ? results[3].value : null,
        heartRate: results[4].status === "fulfilled" ? results[4].value : null,
        exercises: results[5].status === "fulfilled" ? results[5].value : null,
        cardioLoad: results[6].status === "fulfilled" ? results[6].value : null,
        loading: false,
        error: null,
      });
    } catch (e) {
      setData((d) => ({
        ...d,
        loading: false,
        error: e instanceof Error ? e.message : "Failed to fetch data",
      }));
    }
  }, [enabled]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { ...data, refresh: fetchAll };
}
