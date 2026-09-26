"use client";

import { useMemo } from "react";
import { extractSleep, extractRecharge, extractActivity, getSleepDuration, getSleepScore, getHRV, getSteps, getCalories, getActiveMinutes } from "@/lib/data-extractors";
import { generateDemoSleep, generateDemoRecharge, generateDemoActivity } from "@/lib/demo-data";
import { getDays, avg } from "@/lib/formatters";
import type { SleepData, RechargeData, ActivityData } from "@/types/polar";

interface CompareTabProps {
  sleep: SleepData | null;
  recharge: RechargeData | null;
  activity: ActivityData | null;
  range: number;
  isDemo: boolean;
}

export function CompareTab({ sleep, recharge, activity, range, isDemo }: CompareTabProps) {
  const days = getDays(range);

  const sleepList = useMemo(() => {
    const raw = isDemo ? { nights: generateDemoSleep(range) } : sleep;
    return extractSleep(raw, days);
  }, [sleep, range, isDemo, days]);

  const rechargeList = useMemo(() => {
    const raw = isDemo ? { recharges: generateDemoRecharge(range) } : recharge;
    return extractRecharge(raw, days);
  }, [recharge, range, isDemo, days]);

  const activityList = useMemo(() => {
    const raw = isDemo ? { activities: generateDemoActivity(range) } : activity;
    return extractActivity(raw, days);
  }, [activity, range, isDemo, days]);

  const todaySleep = sleepList[sleepList.length - 1] || {};
  const todayRecharge = rechargeList[rechargeList.length - 1] || {};
  const todayAct = activityList[activityList.length - 1] || {};

  const avg7 = computePeriodAvg(sleepList, rechargeList, activityList, 7);
  const avg14 = computePeriodAvg(sleepList, rechargeList, activityList, 14);
  const avg28 = computePeriodAvg(sleepList, rechargeList, activityList, 28);
  const avgAll = computePeriodAvg(sleepList, rechargeList, activityList, 9999);

  const todayValues = {
    steps: getSteps(todayAct),
    cals: getCalories(todayAct),
    activeMin: getActiveMinutes(todayAct),
    sleepHours: getSleepDuration(todaySleep),
    sleepScore: getSleepScore(todaySleep),
    rhr: getRHR(todayRecharge),
    hrv: getHRV(todayRecharge),
    recharge: todayRecharge.nightly_recharge_score ?? todayRecharge.recharge_score ?? 0,
  };

  const metrics = [
    { key: "steps", label: "Steps", unit: "", higher: true },
    { key: "cals", label: "Active Calories", unit: " kcal", higher: true },
    { key: "activeMin", label: "Active Time", unit: " min", higher: true },
    { key: "sleepHours", label: "Sleep Duration", unit: " h", higher: true },
    { key: "sleepScore", label: "Sleep Score", unit: "", higher: true },
    { key: "rhr", label: "Resting HR", unit: " bpm", higher: false },
    { key: "hrv", label: "HRV (RMSSD)", unit: " ms", higher: true },
    { key: "recharge", label: "Nightly Recharge", unit: "", higher: true },
  ] as const;

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {metrics.map((m) => {
          const today = todayValues[m.key] || 0;
          const a7 = avg7[m.key] || 0;
          const a14 = avg14[m.key] || 0;
          const a28 = avg28[m.key] || 0;
          const aAll = avgAll[m.key] || 0;
          const maxVal = Math.max(today, a7, a14, a28, aAll, 1);

          return (
            <div key={m.key} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: "var(--text)" }}>{m.label}</span>
                <span className="font-serif text-lg font-bold" style={{ color: "var(--text)" }}>
                  {m.key === "sleepHours" ? today.toFixed(1) : today.toLocaleString()}
                  <span className="text-[11px] font-normal" style={{ color: "var(--text-dim)" }}>{m.unit}</span>
                </span>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "7d avg", val: a7 },
                  { label: "14d avg", val: a14 },
                  { label: "28d avg", val: a28 },
                  { label: "All time", val: aAll },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span style={{ color: "var(--text-muted)" }}>{row.label}</span>
                      <span style={{ color: "var(--text-dim)" }}>{m.key === "sleepHours" ? row.val.toFixed(1) : Math.round(row.val).toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 rounded-full mt-1" style={{ background: "var(--surface-light)" }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, (row.val / maxVal) * 100)}%`, background: "var(--text-muted)", opacity: 0.5 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function computePeriodAvg(
  sleepList: ReturnType<typeof extractSleep>,
  rechargeList: ReturnType<typeof extractRecharge>,
  actList: ReturnType<typeof extractActivity>,
  periodDays: number
) {
  const s = sleepList.slice(-periodDays);
  const r = rechargeList.slice(-periodDays);
  const a = actList.slice(-periodDays);

  const avgFn = (arr: number[]) => {
    const v = arr.filter((x) => x != null && !isNaN(x));
    return v.length ? v.reduce((x, y) => x + y, 0) / v.length : 0;
  };

  return {
    steps: Math.round(avgFn(a.map((d) => d.steps || 0))),
    cals: Math.round(avgFn(a.map((d) => d.active_calories || d.calories || 0))),
    activeMin: Math.round(avgFn(a.map((d) => d.active_minutes || d.active_time || 0))),
    sleepHours: +(avgFn(s.map((d) => getSleepDuration(d)))).toFixed(1),
    sleepScore: Math.round(avgFn(s.map((d) => getSleepScore(d)))),
    rhr: Math.round(avgFn(r.map((d) => getRHR(d)))),
    hrv: Math.round(avgFn(r.map((d) => getHRV(d)))),
    recharge: Math.round(avgFn(r.map((d) => d.nightly_recharge_score ?? d.recharge_score ?? 0))),
  };
}

function getRHR(night: ReturnType<typeof extractRecharge>[number]): number {
  return night?.resting_heart_rate ?? night?.rhr ?? night?.["resting-heart-rate"] ?? 0;
}
