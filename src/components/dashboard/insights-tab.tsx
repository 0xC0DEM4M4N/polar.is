"use client";

import { useMemo } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Gauge } from "@/components/ui/gauge";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { extractSleep, extractRecharge, extractActivity, getSleepDuration, getSleepScore, getHRV, getSteps } from "@/lib/data-extractors";
import { generateDemoSleep, generateDemoRecharge, generateDemoActivity } from "@/lib/demo-data";
import { getDays } from "@/lib/formatters";
import type { SleepData, RechargeData, ActivityData } from "@/types/polar";

interface InsightsTabProps {
  sleep: SleepData | null;
  recharge: RechargeData | null;
  activity: ActivityData | null;
  range: number;
  isDemo: boolean;
}

export function InsightsTab({ sleep, recharge, activity, range, isDemo }: InsightsTabProps) {
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

  const lastSleep = sleepList[sleepList.length - 1];
  const lastRecharge = rechargeList[rechargeList.length - 1];

  const sleepScore = lastSleep ? getSleepScore(lastSleep) : 0;
  const hrv = lastRecharge ? getHRV(lastRecharge) : 0;
  const rhr = lastRecharge ? getRHR(lastRecharge) : 0;

  // Readiness score algorithm
  const hrvTrend = rechargeList.map((r) => getHRV(r)).filter((v) => v > 0);
  const hrvAvg = hrvTrend.length ? hrvTrend.reduce((a, b) => a + b, 0) / hrvTrend.length : 0;
  const hrvRatio = hrvAvg > 0 ? Math.min(100, (hrv / hrvAvg) * 100) : 50;
  const rhrRatio = rhr > 0 ? Math.max(0, Math.min(100, 100 - (rhr - 50) * 2)) : 50;
  const loadScore = 70; // simplified
  const readiness = Math.round(sleepScore * 0.4 + hrvRatio * 0.3 + loadScore * 0.2 + rhrRatio * 0.1);

  const labels = days.map((d) => new Date(d).toLocaleDateString(undefined, { weekday: "short" }));

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 mb-3.5">
        <div className="rounded-xl p-5 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="font-serif text-sm font-bold mb-2" style={{ color: "var(--text)" }}>Readiness</div>
          <Gauge value={readiness} max={100} />
          <div className="text-[10px] tracking-wider" style={{ color: "var(--text-muted)" }}>READINESS SCORE</div>
          <div className="text-xs mt-2" style={{ color: "var(--text-dim)" }}>
            {readiness >= 80 ? "Ready to train" : readiness >= 60 ? "Moderate readiness" : "Take it easy"}
          </div>
        </div>
        <div className="lg:col-span-2 rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="font-serif text-sm font-bold mb-4" style={{ color: "var(--text)" }}>Recovery Debt</div>
          <BarChart
            labels={labels}
            datasets={[
              {
                label: "Load",
                data: activityList.map((a) => getSteps(a) / 100),
                backgroundColor: "#e8304a40",
                borderColor: "#e8304a",
                borderWidth: 1,
                borderRadius: 3,
              },
              {
                label: "Recovery",
                data: rechargeList.map((r) => getHRV(r) || 0),
                backgroundColor: "#5DCAA540",
                borderColor: "#5DCAA5",
                borderWidth: 1,
                borderRadius: 3,
              },
            ]}
            height={200}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="font-serif text-sm font-bold mb-4" style={{ color: "var(--text)" }}>HRV with Baseline</div>
          <LineChart
            labels={labels}
            datasets={[
              {
                label: "HRV",
                data: rechargeList.map((r) => getHRV(r) || null),
                borderColor: "#5DCAA5",
                backgroundColor: "transparent",
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 2,
              },
            ]}
            height={200}
          />
        </div>
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="font-serif text-sm font-bold mb-4" style={{ color: "var(--text)" }}>Sleep Architecture</div>
          <BarChart
            labels={labels}
            datasets={[
              {
                label: "Sleep (h)",
                data: sleepList.map((s) => getSleepDuration(s)),
                backgroundColor: "#5DCAA540",
                borderColor: "#5DCAA5",
                borderWidth: 1,
                borderRadius: 3,
              },
            ]}
            height={200}
          />
        </div>
      </div>
    </div>
  );
}

function getRHR(night: ReturnType<typeof extractRecharge>[number]): number {
  return night?.resting_heart_rate ?? night?.rhr ?? night?.["resting-heart-rate"] ?? 0;
}
