"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { StatCard } from "@/components/ui/stat-card";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { extractSleep, extractActivity, getSleepDuration, getSteps } from "@/lib/data-extractors";
import { generateDemoSleep, generateDemoActivity, generateDemoHRDay } from "@/lib/demo-data";
import { fmtHours, decToHHMM } from "@/lib/formatters";
import type { SleepData, ActivityData, HeartRateData } from "@/types/polar";

interface TodayTabProps {
  sleep: SleepData | null;
  activity: ActivityData | null;
  heartRate: HeartRateData | null;
  isDemo: boolean;
}

export function TodayTab({ sleep, activity, heartRate, isDemo }: TodayTabProps) {
  const t = useTranslations("dashboard");
  const [todayDate, setTodayDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [layers, setLayers] = useState({ hr: true, steps: true, sleep: true, inactive: false });

  const today = new Date().toISOString().split("T")[0];

  function prevDay() {
    const d = new Date(todayDate + "T12:00:00");
    d.setDate(d.getDate() - 1);
    setTodayDate(d.toISOString().split("T")[0]);
  }

  function nextDay() {
    const d = new Date(todayDate + "T12:00:00");
    d.setDate(d.getDate() + 1);
    const max = new Date().toISOString().split("T")[0];
    const next = d.toISOString().split("T")[0];
    setTodayDate(next > max ? max : next);
  }

  function resetDay() {
    setTodayDate(today);
  }

  const fmtDate = useMemo(() => {
    const d = new Date(todayDate + "T12:00:00");
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (todayDate === today) return { main: "Today", sub: d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }) };
    if (todayDate === yesterday.toISOString().split("T")[0]) return { main: "Yesterday", sub: d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }) };
    return { main: d.toLocaleDateString(undefined, { weekday: "long" }), sub: d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) };
  }, [todayDate, today]);

  // Generate demo or use real data
  const demoSleep = useMemo(() => generateDemoSleep(7), []);
  const demoActivity = useMemo(() => generateDemoActivity(7), []);
  const demoHR = useMemo(() => generateDemoHRDay(todayDate), [todayDate]);

  const sleepList = isDemo ? { nights: demoSleep } : sleep;
  const actList = isDemo ? { activities: demoActivity } : activity;

  const allNights = extractSleep(sleepList, [todayDate]);
  const night = allNights[0];
  const sleepHours = night ? getSleepDuration(night) : 0;

  const allActs = extractActivity(actList, [todayDate]);
  const act = allActs[0];
  const totalSteps = act ? getSteps(act) : 0;

  // Build hourly data
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

  // Demo HR hourly
  const hrByHour = useMemo(() => {
    if (isDemo) {
      return hours.map((_, h) => {
        if (h >= 23 || h <= 6) return 52 + Math.round(Math.random() * 6);
        if (h >= 7 && h <= 9) return 75 + Math.round(Math.random() * 15);
        if (h >= 12 && h <= 13) return 68 + Math.round(Math.random() * 10);
        if (h >= 17 && h <= 19) return 85 + Math.round(Math.random() * 25);
        return 60 + Math.round(Math.random() * 12);
      });
    }
    const samples = heartRate?.heart_rates?.[0]?.heart_rate_samples || [];
    if (!samples.length) return new Array(24).fill(null);
    const buckets: number[][] = Array.from({ length: 24 }, () => []);
    samples.forEach((s) => {
      const dt = new Date(s.datetime || s.time || "");
      if (!isNaN(dt.getTime())) {
        buckets[dt.getHours()].push(s["heart-rate"] ?? s.heartRate ?? s.value ?? 0);
      }
    });
    return buckets.map((vals) => (vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null));
  }, [isDemo, heartRate, hours]);

  // Demo steps hourly
  const stepsByHour = useMemo(() => {
    if (isDemo) {
      const weights = [0.5,0.3,0.2,0.2,0.5,1.5,3,4,3.5,3,2.5,2.5,2.5,2.5,2.5,3,3.5,4,3.5,3,2.5,2,1.5,1];
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      const isWeekend = new Date(todayDate).getDay() === 0 || new Date(todayDate).getDay() === 6;
      const ts = isWeekend ? 14500 : 8200;
      return weights.map((w) => Math.round(ts * (w / totalWeight)));
    }
    return new Array(24).fill(null);
  }, [isDemo, todayDate]);

  const hrVals = hrByHour.filter((v): v is number => v != null);
  const avgHR = hrVals.length ? Math.round(hrVals.reduce((a, b) => a + b, 0) / hrVals.length) : 0;

  const datasets = [];
  if (layers.hr) {
    datasets.push({
      type: "line" as const,
      label: "Heart Rate",
      data: hrByHour,
      borderColor: "#e8304a",
      backgroundColor: "transparent",
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 2,
    });
  }
  if (layers.steps) {
    datasets.push({
      type: "bar" as const,
      label: "Steps",
      data: stepsByHour,
      backgroundColor: "#378ADD40",
      borderColor: "#378ADD",
      borderWidth: 1,
      borderRadius: 3,
    });
  }

  return (
    <div>
      {/* Date Carousel */}
      <div className="flex items-center justify-center gap-4 mb-5">
        <button onClick={prevDay} className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-dim)" }}>←</button>
        <div className="text-center">
          <div className="font-serif text-lg font-bold" style={{ color: "var(--text)" }}>{fmtDate.main}</div>
          <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{fmtDate.sub}</div>
        </div>
        <button onClick={nextDay} className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-dim)" }}>→</button>
        <button onClick={resetDay} className="text-xs rounded-lg px-3 py-1.5 transition-all cursor-pointer ml-2" style={{ color: "var(--text-dim)", border: "1px solid var(--border)", background: "transparent" }}>Today</button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
        <StatCard label="Steps" value={totalSteps ? totalSteps.toLocaleString() : "—"} />
        <StatCard label="Avg HR" value={avgHR || "—"} unit="bpm" color="#e8304a" />
        <StatCard label="Last Night" value={sleepHours ? fmtHours(sleepHours) : "—"} color="#a78bfa" />
        <StatCard label="Active" value={totalSteps ? Math.round(totalSteps * 0.008) : "—"} unit="min" color="#EF9F27" />
      </div>

      {/* 24hr Chart */}
      <div className="rounded-xl p-5 mb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="font-serif text-sm font-bold" style={{ color: "var(--text)" }}>24-Hour View</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Heart rate, steps, sleep — toggle layers below</div>
          </div>
        </div>
        <div className="h-[320px]">
          {layers.hr || layers.steps ? (
            <LineChart labels={hours} datasets={datasets} height={320} />
          ) : (
            <div className="h-full flex items-center justify-center text-sm" style={{ color: "var(--text-muted)" }}>Toggle a layer to view data</div>
          )}
        </div>
        <div className="flex gap-2 mt-4 flex-wrap justify-center">
          {(["hr", "steps", "sleep", "inactive"] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setLayers((l) => ({ ...l, [layer]: !l[layer] }))}
              className="text-[11px] rounded-full px-3 py-1.5 transition-all cursor-pointer"
              style={{
                opacity: layers[layer] ? 1 : 0.4,
                background:
                  layer === "hr" ? "rgba(232,48,74,0.12)" :
                  layer === "steps" ? "rgba(55,138,221,0.12)" :
                  layer === "sleep" ? "rgba(167,139,250,0.12)" :
                  "rgba(100,116,139,0.12)",
                color:
                  layer === "hr" ? "#e8304a" :
                  layer === "steps" ? "#378ADD" :
                  layer === "sleep" ? "#a78bfa" :
                  "#64748b",
                border: `1px solid ${
                  layer === "hr" ? "rgba(232,48,74,0.3)" :
                  layer === "steps" ? "rgba(55,138,221,0.3)" :
                  layer === "sleep" ? "rgba(167,139,250,0.3)" :
                  "rgba(100,116,139,0.3)"
                }`,
              }}
            >
              {layer === "hr" && "❤️ Heart Rate"}
              {layer === "steps" && "👣 Steps"}
              {layer === "sleep" && "💤 Sleep"}
              {layer === "inactive" && "🛏 Inactive"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
