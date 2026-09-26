"use client";

import { useState, useMemo } from "react";
import { LineChart } from "@/components/charts/line-chart";
import { DoughnutChart } from "@/components/charts/doughnut-chart";
import { generateDemoHRDay } from "@/lib/demo-data";
import type { HeartRateData, HeartRateSample } from "@/types/polar";

interface HeartRateTabProps {
  heartRate: HeartRateData | null;
  isDemo: boolean;
  range: number;
}

export function HeartRateTab({ heartRate, isDemo, range }: HeartRateTabProps) {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  const dayData = useMemo(() => {
    if (isDemo) return generateDemoHRDay(date);
    const days = heartRate?.heart_rates || [];
    return days.find((d) => (d.date || "").startsWith(date)) || days[days.length - 1];
  }, [heartRate, isDemo, date]);

  const samples = (dayData as Record<string, unknown> | undefined)?.samples as HeartRateSample[] | undefined || (dayData as Record<string, unknown> | undefined)?.heart_rate_samples as HeartRateSample[] | undefined || [];
  const labels = samples.map((s) => {
    const dt = new Date(s.datetime || s.time || "");
    return isNaN(dt.getTime()) ? "" : dt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  });
  const values = samples.map((s) => s["heart-rate"] ?? s.heartRate ?? s.value ?? 0);

  // Simple zone distribution
  const zones = [0, 0, 0, 0, 0];
  values.forEach((v) => {
    if (v < 100) zones[0]++;
    else if (v < 130) zones[1]++;
    else if (v < 150) zones[2]++;
    else if (v < 170) zones[3]++;
    else zones[4]++;
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-[11px] tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>Date</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md px-2.5 py-1.5 text-xs outline-none"
          style={{ background: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--text)" }}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-3.5">
        <div className="lg:col-span-2 rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="mb-4">
            <div className="font-serif text-sm font-bold" style={{ color: "var(--text)" }}>Continuous Heart Rate</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>5-minute samples throughout the day</div>
          </div>
          <LineChart
            labels={labels}
            datasets={[
              {
                label: "HR",
                data: values,
                borderColor: "#e8304a",
                backgroundColor: "transparent",
                borderWidth: 1.5,
                tension: 0.3,
                pointRadius: 0,
              },
            ]}
            height={260}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="mb-4">
            <div className="font-serif text-sm font-bold" style={{ color: "var(--text)" }}>HR Distribution</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Heart rate zones for the day</div>
          </div>
          <DoughnutChart
            labels={["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5"]}
            data={zones}
            backgroundColor={["#5DCAA5", "#378ADD", "#EF9F27", "#e8304a", "#a78bfa"]}
            height={200}
          />
        </div>
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="mb-4">
            <div className="font-serif text-sm font-bold" style={{ color: "var(--text)" }}>Resting HR Trend</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Across selected period</div>
          </div>
          <div className="h-[200px] flex items-center justify-center text-sm" style={{ color: "var(--text-muted)" }}>
            RHR trend data
          </div>
        </div>
      </div>
    </div>
  );
}
