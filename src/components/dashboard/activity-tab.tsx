"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { StatCard } from "@/components/ui/stat-card";
import { BarChart } from "@/components/charts/bar-chart";
import { extractActivity, getSteps, getCalories, getActiveMinutes } from "@/lib/data-extractors";
import { generateDemoActivity } from "@/lib/demo-data";
import { getDays } from "@/lib/formatters";
import type { ActivityData } from "@/types/polar";

interface ActivityTabProps {
  activity: ActivityData | null;
  range: number;
  isDemo: boolean;
}

export function ActivityTab({ activity, range, isDemo }: ActivityTabProps) {
  const t = useTranslations("dashboard");
  const days = getDays(range);

  const activityList = useMemo(() => {
    const raw = isDemo ? { activities: generateDemoActivity(range) } : activity;
    return extractActivity(raw, days);
  }, [activity, range, isDemo, days]);

  const stepsList = activityList.map((a) => getSteps(a));
  const calsList = activityList.map((a) => getCalories(a));
  const activeList = activityList.map((a) => getActiveMinutes(a));

  const avgSteps = stepsList.length ? Math.round(stepsList.reduce((a, b) => a + b, 0) / stepsList.length) : 0;
  const avgCals = calsList.length ? Math.round(calsList.reduce((a, b) => a + b, 0) / calsList.length) : 0;
  const goalDays = stepsList.filter((s) => s >= 10000).length;
  const avgActive = activeList.length ? Math.round(activeList.reduce((a, b) => a + b, 0) / activeList.length) : 0;

  const labels = days.map((d) => new Date(d).toLocaleDateString(undefined, { weekday: "short" }));

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        <StatCard label={t("stats.avgSteps")} value={avgSteps ? avgSteps.toLocaleString() : "—"} color="#378ADD" />
        <StatCard label={t("stats.avgKcal")} value={avgCals ? avgCals.toLocaleString() : "—"} color="#EF9F27" />
        <StatCard label={t("stats.goalDays")} value={goalDays || "—"} color="#5DCAA5" />
        <StatCard label={t("stats.avgActive")} value={avgActive || "—"} unit="min" color="#a78bfa" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="mb-4">
            <div className="font-serif text-sm font-bold" style={{ color: "var(--text)" }}>Daily Steps</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Goal line at 10,000</div>
          </div>
          <BarChart
            labels={labels}
            datasets={[
              {
                label: "Steps",
                data: stepsList,
                backgroundColor: "#378ADD40",
                borderColor: "#378ADD",
                borderWidth: 1,
                borderRadius: 3,
              },
            ]}
            height={220}
          />
        </div>
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="mb-4">
            <div className="font-serif text-sm font-bold" style={{ color: "var(--text)" }}>Active Calories</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>kcal burned each day</div>
          </div>
          <BarChart
            labels={labels}
            datasets={[
              {
                label: "kcal",
                data: calsList,
                backgroundColor: "#EF9F2740",
                borderColor: "#EF9F27",
                borderWidth: 1,
                borderRadius: 3,
              },
            ]}
            height={220}
          />
        </div>
      </div>
    </div>
  );
}
