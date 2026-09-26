import type {
  SleepData,
  RechargeData,
  ActivityData,
  HeartRateData,
  SleepNight,
  RechargeNight,
  ActivityDay,
} from "@/types/polar";
import { getDays, avg } from "@/lib/formatters";

export function extractSleep(data: SleepData | null, days: string[]): SleepNight[] {
  if (!data?.nights) return [];
  const nights = Array.isArray(data.nights) ? data.nights : [];
  return days
    .map((d) => {
      const n = nights.find((x) =>
        (x.date || x.sleep_start_time || "").startsWith(d)
      );
      return n;
    })
    .filter(Boolean) as SleepNight[];
}

export function extractRecharge(data: RechargeData | null, days: string[]): RechargeNight[] {
  if (!data) return [];
  const nights =
    (data.recharges || data.nightly_recharges || []) as RechargeNight[];
  return days
    .map((d) => {
      const n = nights.find((x) => (x.date || "").startsWith(d));
      return n;
    })
    .filter(Boolean) as RechargeNight[];
}

export function extractActivity(data: ActivityData | null, days: string[]): ActivityDay[] {
  if (!data?.activities) return [];
  const acts = Array.isArray(data.activities) ? data.activities : [];
  return days
    .map((d) => {
      const a = acts.find((x) => (x.date || x.start_time || "").startsWith(d));
      return a;
    })
    .filter(Boolean) as ActivityDay[];
}

export function getSleepDuration(night: SleepNight): number {
  const total =
    night.sleep_time_total ??
    night["sleep-time-total"] ??
    night.total_sleep_time ??
    night.sleep_duration ??
    0;
  return total ? +(total / 3600).toFixed(1) : 0;
}

export function getSleepScore(night: SleepNight): number {
  return night.sleep_score ?? night.score ?? 0;
}

export function getRHR(night: RechargeNight): number {
  return (
    night.resting_heart_rate ?? night.rhr ?? night["resting-heart-rate"] ?? 0
  );
}

export function getHRV(night: RechargeNight): number {
  return (
    night.heart_rate_variability ??
    night.hrv ??
    night["heart-rate-variability"] ??
    0
  );
}

export function getSteps(day: ActivityDay): number {
  return day.steps ?? 0;
}

export function getCalories(day: ActivityDay): number {
  return day.active_calories ?? day.calories ?? 0;
}

export function getActiveMinutes(day: ActivityDay): number {
  return day.active_minutes ?? day.active_time ?? 0;
}

export { getDays, avg };
