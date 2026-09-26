"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { StatCard } from "@/components/ui/stat-card";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { extractSleep, getSleepDuration, getSleepScore } from "@/lib/data-extractors";
import { generateDemoSleep } from "@/lib/demo-data";
import { getDays, avg } from "@/lib/formatters";
import type { SleepData } from "@/types/polar";

interface SleepTabProps {
  sleep: SleepData | null;
  range: number;
  isDemo: boolean;
}

export function SleepTab({ sleep, range, isDemo }: SleepTabProps) {
  const t = useTranslations("dashboard");
  const days = getDays(range);

  const sleepList = useMemo(() => {
    const raw = isDemo ? { nights: generateDemoSleep(range) } : sleep;
    return extractSleep(raw, days);
  }, [sleep, range, isDemo, days]);

  const durations = sleepList.map((s) => getSleepDuration(s));
  const scores = sleepList.map((s) => getSleepScore(s));
  const avgSleep = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const nights7h = durations.filter((d) => d >= 7).length;

  const labels = days.map((d) => new Date(d).toLocaleDateString(undefined, { weekday: "short" }));

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 mb-3.5">
        <div className="lg:col-span-2 rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-serif text-sm font-bold" style={{ color: "var(--text)" }}>Sleep Duration</div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Hours per night</div>
            </div>
            <div className="text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap" style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              {avgSleep ? `${avgSleep.toFixed(1)} h avg` : "—"}
            </div>
          </div>
          <BarChart
            labels={labels}
            datasets={[
              {
                label: "Hours",
                data: durations,
                backgroundColor: "#5DCAA540",
                borderColor: "#5DCAA5",
                borderWidth: 1,
                borderRadius: 3,
              },
            ]}
            height={220}
          />
        </div>
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="mb-4">
            <div className="font-serif text-sm font-bold" style={{ color: "var(--text)" }}>Sleep Score</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Polar quality score (0–100)</div>
          </div>
          <LineChart
            labels={labels}
            datasets={[
              {
                label: "Score",
                data: scores,
                borderColor: "#a78bfa",
                backgroundColor: "transparent",
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 2,
              },
            ]}
            height={220}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        <StatCard label={t("stats.avgSleep")} value={avgSleep ? avgSleep.toFixed(1) : "—"} unit="h" />
        <StatCard label={t("stats.avgScore")} value={avgScore || "—"} />
        <StatCard label={t("stats.nights7h")} value={nights7h || "—"} />
      </div>
    </div>
  );
}
