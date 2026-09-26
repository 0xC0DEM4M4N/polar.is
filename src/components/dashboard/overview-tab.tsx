"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { StatCard } from "@/components/ui/stat-card";
import { Gauge } from "@/components/ui/gauge";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { useChartColors } from "@/lib/colors";
import {
  extractSleep,
  extractRecharge,
  extractActivity,
  getSleepDuration,
  getSleepScore,
  getRHR,
  getHRV,
  getSteps,
  getDays,
} from "@/lib/data-extractors";
import { generateDemoSleep, generateDemoRecharge, generateDemoActivity } from "@/lib/demo-data";
import type { SleepData, RechargeData, ActivityData } from "@/types/polar";

interface OverviewTabProps {
  sleep: SleepData | null;
  recharge: RechargeData | null;
  activity: ActivityData | null;
  range: number;
  isDemo: boolean;
}

export function OverviewTab({ sleep, recharge, activity, range, isDemo }: OverviewTabProps) {
  const t = useTranslations("dashboard");
  const colors = useChartColors();
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
  const lastActivity = activityList[activityList.length - 1];

  const rhr = lastRecharge ? getRHR(lastRecharge) : 0;
  const hrv = lastRecharge ? getHRV(lastRecharge) : 0;
  const steps = lastActivity ? getSteps(lastActivity) : 0;
  const sleepHours = lastSleep ? getSleepDuration(lastSleep) : 0;

  const rhrTrend = rechargeList.map((r) => getRHR(r)).filter((v) => v > 0);
  const hrvTrend = rechargeList.map((r) => getHRV(r)).filter((v) => v > 0);
  const stepsTrend = activityList.map((a) => getSteps(a));
  const sleepTrend = sleepList.map((s) => getSleepDuration(s));

  const sleepBars = sleepList.slice(-7).map((s) => {
    const h = getSleepDuration(s);
    return {
      hours: h,
      color: h >= 7 ? "#5DCAA5" : h >= 6 ? "#EF9F27" : "#e8304a",
    };
  });

  const chartLabels = days.map((d) =>
    new Date(d).toLocaleDateString(undefined, { weekday: "short" })
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
          Today at a glance
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        <StatCard label={t("stats.rhr")} value={rhr || "—"} unit="bpm" color="#e8304a" />
        <StatCard label={t("stats.hrv")} value={hrv || "—"} unit="ms" color="#5DCAA5" />
        <StatCard label={t("stats.steps")} value={steps ? steps.toLocaleString() : "—"} color="#378ADD" />
        <StatCard label={t("stats.sleep")} value={sleepHours || "—"} unit="h" color="#EF9F27" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 mb-3.5">
        <div className="lg:col-span-2 rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-serif text-sm font-bold" style={{ color: "var(--text)" }}>Resting Heart Rate</div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Daily average across selected period</div>
            </div>
            <div className="text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap" style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              {rhrTrend.length ? `${Math.round(rhrTrend.reduce((a, b) => a + b, 0) / rhrTrend.length)} bpm avg` : "—"}
            </div>
          </div>
          <LineChart
            labels={chartLabels}
            datasets={[
              {
                label: "RHR",
                data: rechargeList.map((r) => getRHR(r) || null),
                borderColor: "#e8304a",
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
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-serif text-sm font-bold" style={{ color: "var(--text)" }}>HRV</div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>RMSSD trend</div>
            </div>
          </div>
          <Gauge value={hrv || 0} max={120} />
          <div className="text-[10px] text-center tracking-wider" style={{ color: "var(--text-muted)" }}>CURRENT HRV (ms)</div>
          <div className="h-20 mt-3">
            <LineChart
              labels={chartLabels}
              datasets={[
                {
                  label: "HRV",
                  data: rechargeList.map((r) => getHRV(r) || null),
                  borderColor: "#5DCAA5",
                  backgroundColor: "rgba(93,202,165,0.1)",
                  fill: true,
                  borderWidth: 1.5,
                  tension: 0.3,
                  pointRadius: 0,
                },
              ]}
              height={80}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-serif text-sm font-bold" style={{ color: "var(--text)" }}>Daily Steps</div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Goal: 10,000/day</div>
            </div>
            <div className="text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap" style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              {stepsTrend.length ? `${Math.round(stepsTrend.reduce((a, b) => a + b, 0) / stepsTrend.length).toLocaleString()} avg` : "—"}
            </div>
          </div>
          <BarChart
            labels={chartLabels}
            datasets={[
              {
                label: "Steps",
                data: activityList.map((a) => getSteps(a) || null),
                backgroundColor: "#378ADD40",
                borderColor: "#378ADD",
                borderWidth: 1,
                borderRadius: 3,
              },
            ]}
            height={180}
          />
        </div>

        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-serif text-sm font-bold" style={{ color: "var(--text)" }}>Sleep Duration</div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Last 7 nights</div>
            </div>
            <div className="text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap" style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              {sleepTrend.length ? `${(sleepTrend.reduce((a, b) => a + b, 0) / sleepTrend.length).toFixed(1)} h avg` : "—"}
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {sleepBars.map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-md flex flex-col justify-end overflow-hidden"
                  style={{ height: 80, background: "var(--surface-light)" }}
                >
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${Math.min(100, (bar.hours / 10) * 100)}%`,
                      background: bar.color,
                    }}
                  />
                </div>
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {bar.hours.toFixed(1)}h
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
