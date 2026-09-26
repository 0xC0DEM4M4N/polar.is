"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { StatCard } from "@/components/ui/stat-card";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { extractRecharge, getHRV, getRHR } from "@/lib/data-extractors";
import { generateDemoRecharge } from "@/lib/demo-data";
import { getDays } from "@/lib/formatters";
import type { RechargeData } from "@/types/polar";

interface RecoveryTabProps {
  recharge: RechargeData | null;
  range: number;
  isDemo: boolean;
}

export function RecoveryTab({ recharge, range, isDemo }: RecoveryTabProps) {
  const t = useTranslations("dashboard");
  const days = getDays(range);

  const rechargeList = useMemo(() => {
    const raw = isDemo ? { recharges: generateDemoRecharge(range) } : recharge;
    return extractRecharge(raw, days);
  }, [recharge, range, isDemo, days]);

  const hrvList = rechargeList.map((r) => getHRV(r));
  const ansList = rechargeList.map((r) => r.ans_charge ?? r.ans ?? r["ans-charge"] ?? 0);
  const rcList = rechargeList.map((r) => r.nightly_recharge_score ?? r.recharge_score ?? r["nightly-recharge-score"] ?? 0);
  const brList = rechargeList.map((r) => r.breathing_rate ?? r.breathing ?? r["breathing-rate"] ?? 0);

  const avgHrv = hrvList.length ? Math.round(hrvList.reduce((a, b) => a + b, 0) / hrvList.length) : 0;
  const avgAns = ansList.length ? Math.round(ansList.reduce((a, b) => a + b, 0) / ansList.length) : 0;
  const avgRc = rcList.length ? Math.round(rcList.reduce((a, b) => a + b, 0) / rcList.length) : 0;
  const avgBr = brList.length ? Math.round(brList.reduce((a, b) => a + b, 0) / brList.length) : 0;

  const labels = days.map((d) => new Date(d).toLocaleDateString(undefined, { weekday: "short" }));

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        <StatCard label={t("stats.avgHrv")} value={avgHrv || "—"} unit="ms" color="#5DCAA5" />
        <StatCard label={t("stats.avgAns")} value={avgAns || "—"} color="#378ADD" />
        <StatCard label={t("stats.avgRecharge")} value={avgRc || "—"} color="#EF9F27" />
        <StatCard label={t("stats.avgBreathing")} value={avgBr || "—"} unit="br/min" color="#e8304a" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-3.5">
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="mb-4">
            <div className="font-serif text-sm font-bold" style={{ color: "var(--text)" }}>HRV Trend</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>RMSSD across selected period</div>
          </div>
          <LineChart
            labels={labels}
            datasets={[
              {
                label: "HRV",
                data: hrvList,
                borderColor: "#5DCAA5",
                backgroundColor: "rgba(93,202,165,0.1)",
                fill: true,
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 2,
              },
            ]}
            height={220}
          />
        </div>
        <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="mb-4">
            <div className="font-serif text-sm font-bold" style={{ color: "var(--text)" }}>ANS Charge</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Autonomic nervous system recovery score</div>
          </div>
          <BarChart
            labels={labels}
            datasets={[
              {
                label: "ANS",
                data: ansList,
                backgroundColor: "#378ADD40",
                borderColor: "#378ADD",
                borderWidth: 1,
                borderRadius: 3,
              },
            ]}
            height={220}
          />
        </div>
      </div>
      <div className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="mb-4">
          <div className="font-serif text-sm font-bold" style={{ color: "var(--text)" }}>Nightly Recharge Score</div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Overall recovery quality</div>
        </div>
        <LineChart
          labels={labels}
          datasets={[
            {
              label: "Score",
              data: rcList,
              borderColor: "#EF9F27",
              backgroundColor: "transparent",
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 2,
            },
          ]}
          height={180}
        />
      </div>
    </div>
  );
}
